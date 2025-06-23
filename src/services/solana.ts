import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
  Commitment,
} from "@solana/web3.js";
import bs58 from "bs58";
import { derivePath } from "ed25519-hd-key";
import BigNumber from "bignumber.js";
import { TRANSACTION_LIMIT } from "@/constants";
import {
  ITransaction,
  TResetConnectionFunction,
  TIsValidAddressFunction,
  TFetchBalanceFunction,
  TDeriveNetworkAccountFunction,
  TFetchTransactionsFunction,
  TSendTokensFunction,
  TGetExplorerUrlFunction,
  TRequestAirdropFunction,
} from "@/types";
import getRpcUrl from "@/utils/getRpcUrl";

let solanaConnection: Connection | null = null;

const DEFAULT_COMMITMENT: Commitment = "confirmed";

const getSolanaConnection = (): Connection => {
  if (!solanaConnection) {
    solanaConnection = new Connection(getRpcUrl("solana"), DEFAULT_COMMITMENT);
  }
  return solanaConnection;
};

const getSolanaKeypairFromPrivateKey = (privateKey: string): Keypair => {
  try {
    const decoded = bs58.decode(privateKey);
    if (decoded.length !== 64) {
      throw new Error("Invalid private key length");
    }
    return Keypair.fromSecretKey(decoded);
  } catch {
    throw new Error("Invalid private key format");
  }
};

const convertLamportsToSol = (lamports: number): string => {
  if (lamports < 0) throw new Error("Lamports cannot be negative");
  return new BigNumber(lamports).dividedBy(LAMPORTS_PER_SOL).toString();
};

const convertSolToLamports = (sol: string): number => {
  const parsed = new BigNumber(sol);
  if (parsed.isNaN() || parsed.isNegative() || parsed.isZero()) {
    throw new Error(
      "Invalid SOL amount - must be a positive number greater than zero"
    );
  }

  const result = parsed.multipliedBy(LAMPORTS_PER_SOL).integerValue();
  if (result.isGreaterThan(Number.MAX_SAFE_INTEGER)) {
    throw new Error("Amount too large - exceeds maximum safe integer");
  }

  return result.toNumber();
};

const validateAndGetSolanaPublicKey = (address: string): PublicKey => {
  try {
    return new PublicKey(address);
  } catch {
    throw new Error("Invalid Solana address");
  }
};

export const resetSolanaConnection: TResetConnectionFunction = () => {
  solanaConnection = null;
};

export const isValidSolanaAddress: TIsValidAddressFunction = (address) => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

export const fetchSolanaBalance: TFetchBalanceFunction = async (address) => {
  const pubkey = validateAndGetSolanaPublicKey(address);
  const connection = getSolanaConnection();
  const balance = await connection.getBalance(pubkey);
  return convertLamportsToSol(balance);
};

export const deriveSolanaAccount: TDeriveNetworkAccountFunction = async (
  seed,
  index
) => {
  if (!seed?.length) throw new Error("Seed cannot be empty");
  if (index < 0 || !Number.isInteger(index)) {
    throw new Error("Index must be a non-negative integer");
  }

  const path = `m/44'/501'/${index}'/0'`;
  const { key } = derivePath(path, seed.toString("hex"));
  const keypair = Keypair.fromSeed(key);

  const address = keypair.publicKey.toBase58();
  const privateKey = bs58.encode(keypair.secretKey);
  const balance = await fetchSolanaBalance(address);

  return { address, privateKey, balance };
};

export const fetchSolanaTransactions: TFetchTransactionsFunction = async (
  address
) => {
  const pubkey = validateAndGetSolanaPublicKey(address);
  const connection = getSolanaConnection();

  const signatures = await connection.getSignaturesForAddress(pubkey, {
    limit: TRANSACTION_LIMIT,
  });

  if (signatures.length === 0) return [];

  const transactions: (ITransaction | null)[] = await Promise.all(
    signatures.map(async ({ signature }) => {
      try {
        const txn = await connection.getParsedTransaction(signature, {
          maxSupportedTransactionVersion: 0,
        });

        if (!txn || !txn.meta) return null;

        const instruction = txn.transaction.message.instructions.find(
          (ix) =>
            "program" in ix &&
            ix.program === "system" &&
            "parsed" in ix &&
            ix.parsed?.type === "transfer"
        );

        if (!instruction || !("parsed" in instruction)) return null;

        const { source, destination, lamports } = instruction.parsed.info;

        if (!source || !destination || lamports == null) return null;

        return {
          network: "solana",
          signature,
          from: source,
          to: destination,
          amount: convertLamportsToSol(lamports),
          fee: txn.meta.fee ? convertLamportsToSol(txn.meta.fee) : "0",
          block: txn.slot.toString(),
          timestamp: txn.blockTime ? txn.blockTime * 1000 : Date.now(),
          status: txn.meta.err ? "failed" : "success",
          type:
            source === destination ? "self" : address === source ? "out" : "in",
        };
      } catch (err) {
        console.warn(`Failed to process transaction ${signature}:`, err);
        return null;
      }
    })
  );

  return transactions
    .filter((txn): txn is ITransaction => txn !== null)
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const sendSolana: TSendTokensFunction = async (
  fromPrivateKey,
  toAddress,
  amount
) => {
  const toPubkey = validateAndGetSolanaPublicKey(toAddress);
  const lamports = convertSolToLamports(amount);
  const fromKeypair = getSolanaKeypairFromPrivateKey(fromPrivateKey);
  const connection = getSolanaConnection();

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey,
      lamports,
    })
  );

  transaction.feePayer = fromKeypair.publicKey;
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [fromKeypair],
    { maxRetries: 3, commitment: DEFAULT_COMMITMENT }
  );

  const txDetails = await connection.getTransaction(signature, {
    maxSupportedTransactionVersion: 0,
  });

  if (!txDetails) {
    throw new Error("Transaction not confirmed or dropped by the network");
  }

  const from = fromKeypair.publicKey.toBase58();

  return {
    network: "solana",
    signature,
    from,
    to: toAddress,
    amount: convertLamportsToSol(lamports),
    fee: txDetails.meta?.fee ? convertLamportsToSol(txDetails.meta.fee) : "0",
    block: txDetails.slot.toString(),
    timestamp: txDetails.blockTime ? txDetails.blockTime * 1000 : Date.now(),
    status: txDetails.meta?.err ? "failed" : "success",
    type: from === toAddress ? "self" : "out",
  };
};

export const getSolanaExplorerUrl: TGetExplorerUrlFunction = (
  type,
  networkMode,
  value
) => {
  return `https://solscan.io/${type}/${value}${
    networkMode === "testnet" ? "?cluster=devnet" : ""
  }`;
};

export const requestSolanaAirdrop: TRequestAirdropFunction = async (
  toAddress,
  amount
) => {
  const pubkey = validateAndGetSolanaPublicKey(toAddress);
  const lamports = convertSolToLamports(amount);
  if (lamports > 5 * LAMPORTS_PER_SOL) {
    throw new Error("You can only request up to 5 SOL at a time.");
  }
  const testnetRpc = getRpcUrl("solana", "testnet");
  const connection = new Connection(testnetRpc, DEFAULT_COMMITMENT);
  return await connection.requestAirdrop(pubkey, lamports);
};
