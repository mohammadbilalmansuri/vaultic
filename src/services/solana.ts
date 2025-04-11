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
import { TxHistoryItem } from "@/types";
import getRpcUrl from "@/utils/getRpcUrl";

let connection: Connection = new Connection(getRpcUrl("solana"), "confirmed");

export const resetSolanaConnection = () => {
  connection = new Connection(getRpcUrl("solana"), "confirmed");
};

export const sendSolana = async (
  fromPrivateKey: string,
  toAddress: string,
  amount: string
): Promise<string> => {
  try {
    const lamports = Math.floor(Number(amount) * LAMPORTS_PER_SOL);
    if (isNaN(lamports) || lamports <= 0) throw new Error("Invalid amount.");

    const fromKeypair = Keypair.fromSecretKey(bs58.decode(fromPrivateKey));
    const toPubkey = new PublicKey(toAddress);

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
    throw new Error(
      `Failed to send SOL: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const getSolanaHistory = async (
  address: string
): Promise<TxHistoryItem[]> => {
  try {
    const pubkey = new PublicKey(address);
    const signatures = await connection.getSignaturesForAddress(pubkey, {
      limit: 20,
    });

    const transactions = await Promise.all(
      signatures.map(async (sig) => {
        try {
          const tx = await connection.getTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0,
          });

          if (!tx || !tx.meta) return null;

          const message = tx.transaction.message;
          const accountKeys = message.getAccountKeys();

          const from = accountKeys.get(0)?.toBase58();
          const to = accountKeys.get(1)?.toBase58() ?? "Unknown recipient";

          const amount =
            (tx.meta.preBalances[0] - tx.meta.postBalances[0]) /
            LAMPORTS_PER_SOL;

          return {
            hash: sig.signature,
            from,
            to,
            amount: amount.toFixed(6),
            timestamp: (tx.blockTime || 0) * 1000,
          };
        } catch (err) {
          console.warn(`Failed to process transaction ${sig.signature}`, err);
          return null;
        }
      })
    );

    return transactions
      .filter((tx): tx is TxHistoryItem => tx !== null)
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    throw new Error(
      `Unable to fetch transaction history: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const getSolanaBalance = async (address: string): Promise<string> => {
  try {
    const pubkey = new PublicKey(address);
    const balance = await connection.getBalance(pubkey, "confirmed");
    return (balance / LAMPORTS_PER_SOL).toFixed(6);
  } catch (error) {
    throw new Error(
      `Unable to fetch balance: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
