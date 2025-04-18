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
import { ITxHistoryItem } from "@/types";
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

export const resetSolanaConnection = () => {
  solanaConnection = null;
};

export const sendSolana = async (
  fromPrivateKey: string,
  toAddress: string,
  amount: string
): Promise<string> => {
  try {
    const lamports = Math.floor(Number(amount) * LAMPORTS_PER_SOL);
    if (isNaN(lamports) || lamports <= 0) throw new Error("Invalid amount");

    const decodedKey = bs58.decode(fromPrivateKey);
    if (decodedKey.length !== 64) throw new Error("Invalid private key length");

    const fromKeypair = Keypair.fromSecretKey(decodedKey);
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
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      fromKeypair,
    ]);

    return signature;
  } catch (error) {
    console.error("Error sending Solana:", error);
    throw error;
  }
};

export const getSolanaBalance = async (address: string): Promise<string> => {
  try {
    const connection = getSolanaConnection();
    const pubkey = new PublicKey(address);
    const balance = await connection.getBalance(pubkey, "confirmed");
    return formatBalance((balance / LAMPORTS_PER_SOL).toString());
  } catch (error) {
    console.error("Error fetching Solana balance:", error);
    throw error;
  }
};

export const getSolanaHistory = async (
  address: string
): Promise<ITxHistoryItem[]> => {
  try {
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

          if (!tx || !tx.meta || !tx.transaction) return null;

          const instruction = tx.transaction.message.instructions.find(
            (ix) =>
              "program" in ix &&
              ix.program === "system" &&
              "parsed" in ix &&
              ix.parsed?.type === "transfer"
          );

          if (!instruction || !("parsed" in instruction)) return null;

          const parsed = instruction.parsed as any;

          return {
            hash: sig.signature,
            from: parsed.info.source,
            to: parsed.info.destination,
            amount: formatBalance(
              (parsed.info.lamports / LAMPORTS_PER_SOL).toString()
            ),
            timestamp: (tx.blockTime || 0) * 1000,
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
  } catch (error) {
    console.error("Error fetching Solana history:", error);
    throw error;
  }
};
