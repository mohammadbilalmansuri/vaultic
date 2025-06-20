import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import bs58 from "bs58";
import { derivePath } from "ed25519-hd-key";
import BigNumber from "bignumber.js";
import { ITransaction, INetworkAccount } from "@/types";
import getRpcUrl from "@/utils/getRpcUrl";

let solanaConnection: Connection | null = null;

const getSolanaConnection = (): Connection => {
  if (!solanaConnection) {
    const rpc = getRpcUrl("solana");
    solanaConnection = new Connection(rpc, "confirmed");
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

const convertSolToLamports = (sol: string): number => {
  const parsed = new BigNumber(sol);
  if (parsed.isNaN() || parsed.isNegative() || parsed.isZero()) {
    throw new Error("Invalid SOL amount");
  }
  return parsed.multipliedBy(LAMPORTS_PER_SOL).integerValue().toNumber();
};

const convertLamportsToSol = (lamports: number): string => {
  return new BigNumber(lamports).dividedBy(LAMPORTS_PER_SOL).toString();
};

const validateAndGetSolanaPublicKey = (address: string): PublicKey => {
  try {
    return new PublicKey(address);
  } catch (error) {
    throw new Error("Invalid Solana address");
  }
};

export const resetSolanaConnection = () => {
  solanaConnection = null;
};

export const isValidSolanaAddress = (address: string): boolean => {
  try {
    validateAndGetSolanaPublicKey(address);
    return true;
  } catch {
    return false;
  }
};

export const getSolanaBalance = async (address: string): Promise<string> => {
  const pubkey = validateAndGetSolanaPublicKey(address);
  const balance = await getSolanaConnection().getBalance(pubkey, "confirmed");
  return convertLamportsToSol(balance);
};

export const sendSolana = async (
  fromPrivateKey: string,
  toAddress: string,
  amount: string
): Promise<ITransaction> => {
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

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    fromKeypair,
  ]);

  const txDetails = await connection.getTransaction(signature, {
    maxSupportedTransactionVersion: 0,
  });

  if (!txDetails) {
    throw new Error(
      "Transaction not found. It may still be pending, rejected, or dropped by the network."
    );
  }

  return {
    network: "solana",
    signature,
    from: fromKeypair.publicKey.toBase58(),
    to: toAddress,
    amount: convertLamportsToSol(lamports),
    block: txDetails.slot,
    fee: txDetails.meta?.fee ? convertLamportsToSol(txDetails.meta.fee) : "0",
    timestamp: txDetails.blockTime ? txDetails.blockTime * 1000 : Date.now(),
    status: txDetails.meta?.err ? "failed" : "success",
    type: "send",
  };
};

export const getSolanaTransactions = async (
  address: string
): Promise<ITransaction[]> => {
  const pubkey = validateAndGetSolanaPublicKey(address);
  const connection = getSolanaConnection();

  const signatures = await connection.getSignaturesForAddress(pubkey, {
    limit: 10,
  });

  const transactions: (ITransaction | null)[] = await Promise.all(
    signatures.map(async (sig) => {
      try {
        const tx = await connection.getParsedTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0,
        });

        if (!tx) return null;

        const instruction = tx.transaction.message.instructions.find(
          (ix) =>
            "program" in ix &&
            ix.program === "system" &&
            "parsed" in ix &&
            ix.parsed?.type === "transfer"
        );

        if (!instruction || !("parsed" in instruction)) return null;

        const { source, destination, lamports } = instruction.parsed.info;

        if (!source || !destination || !lamports) return null;

        return {
          network: "solana",
          signature: sig.signature,
          from: source,
          to: destination,
          amount: convertLamportsToSol(lamports),
          block: tx.slot,
          fee: tx.meta?.fee ? convertLamportsToSol(tx.meta.fee) : "0",
          timestamp: tx.blockTime ? tx.blockTime * 1000 : Date.now(),
          status: sig.err ? "failed" : "success",
          type: address === source ? "send" : "receive",
        };
      } catch (err) {
        console.warn(`Failed to process transaction ${sig.signature}`, err);
        return null;
      }
    })
  );

  return transactions
    .filter((tx): tx is ITransaction => tx !== null)
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const requestSolanaAirdrop = async (
  toAddress: string,
  amount: string
): Promise<string> => {
  const pubkey = validateAndGetSolanaPublicKey(toAddress);
  const lamports = convertSolToLamports(amount);
  if (lamports > 5 * LAMPORTS_PER_SOL) {
    throw new Error("You can only request up to 5 SOL at a time.");
  }
  const testnetRpc = getRpcUrl("solana", "testnet");
  const connection = new Connection(testnetRpc, "confirmed");
  return connection.requestAirdrop(pubkey, lamports);
};

export const deriveSolanaAccount = async (
  seed: Buffer,
  index: number
): Promise<INetworkAccount> => {
  const path = `m/44'/501'/${index}'/0'`;
  const { key } = derivePath(path, seed.toString("hex"));
  const keypair = Keypair.fromSeed(key);

  const address = keypair.publicKey.toBase58();
  const privateKey = bs58.encode(keypair.secretKey);
  const balance = await getSolanaBalance(address);

  return { address, privateKey, balance };
};
