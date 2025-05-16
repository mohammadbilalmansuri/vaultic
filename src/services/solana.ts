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
import nacl from "tweetnacl";
import { ITxHistoryItem, TNetworkAccount } from "@/types";
import getRpcUrl from "@/utils/getRpcUrl";
import formatBalance from "@/utils/formatBalance";

let solanaConnection: Connection | null = null;

const getSolanaConnection = (): Connection => {
  if (!solanaConnection) {
    const rpc = getRpcUrl("solana");
    solanaConnection = new Connection(rpc, "confirmed");
  }
  return solanaConnection;
};

const getSolanaKeypairFromPrivateKey = (privateKey: string): Keypair => {
  const decoded = bs58.decode(privateKey);
  if (decoded.length !== 64) throw new Error("Invalid private key");
  return Keypair.fromSecretKey(decoded);
};

const convertSolToLamports = (amount: string): number => {
  const parsed = Number(amount);
  if (isNaN(parsed) || parsed <= 0) throw new Error("Invalid amount");
  return Math.floor(parsed * LAMPORTS_PER_SOL);
};

export const resetSolanaConnection = () => {
  solanaConnection = null;
};

export const isValidSolanaAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

export const sendSolana = async (
  fromPrivateKey: string,
  toAddress: string,
  amount: string
): Promise<string> => {
  const lamports = convertSolToLamports(amount);
  const fromKeypair = getSolanaKeypairFromPrivateKey(fromPrivateKey);
  const toPubkey = new PublicKey(toAddress);
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

  return signature;
};

export const getSolanaBalance = async (address: string): Promise<string> => {
  const pubkey = new PublicKey(address);
  const balance = await getSolanaConnection().getBalance(pubkey, "confirmed");
  return formatBalance((balance / LAMPORTS_PER_SOL).toString());
};

export const getSolanaHistory = async (
  address: string
): Promise<ITxHistoryItem[]> => {
  const connection = getSolanaConnection();
  const pubkey = new PublicKey(address);

  const signatures = await connection.getSignaturesForAddress(pubkey, {
    limit: 20,
  });

  const transactions = await Promise.all(
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

        const parsed = instruction.parsed;

        return {
          hash: sig.signature,
          from: parsed.info.source,
          to: parsed.info.destination,
          amount: formatBalance(
            (parsed.info.lamports / LAMPORTS_PER_SOL).toString()
          ),
          timestamp: (tx.blockTime ?? 0) * 1000,
          network: "solana",
          status: sig.err ? "failed" : "success",
        };
      } catch (err) {
        console.warn(`Failed to process transaction ${sig.signature}`, err);
        return null;
      }
    })
  );

  return transactions
    .filter((tx): tx is ITxHistoryItem => tx !== null)
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const requestSolanaAirdrop = async (
  toAddress: string,
  amount: string
): Promise<string> => {
  const lamports = convertSolToLamports(amount);
  if (lamports > 5 * LAMPORTS_PER_SOL)
    throw new Error("You can only request up to 5 SOL at a time.");

  const devnetRpc = getRpcUrl("solana", "devnet");
  const connection = new Connection(devnetRpc, "confirmed");
  const pubkey = new PublicKey(toAddress);

  return connection.requestAirdrop(pubkey, lamports);
};

export const deriveSolanaAccount = async (
  seed: Buffer,
  index: number
): Promise<TNetworkAccount> => {
  const path = `m/44'/501'/${index}'/0'`;
  const { key } = derivePath(path, seed.toString("hex"));
  const keypair = Keypair.fromSeed(key);

  const address = keypair.publicKey.toBase58();
  const privateKey = bs58.encode(keypair.secretKey);
  const balance = await getSolanaBalance(address);

  return { address, privateKey, balance };
};
