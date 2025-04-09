import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import { TxHistoryItem } from "@/types";
import getRpcUrl from "@/utils/getRpcUrl";

const createSolanaConnection = (): Connection => {
  const rpcUrl = getRpcUrl("solana");
  return new Connection(rpcUrl, "confirmed");
};

export const sendSolana = async (
  fromPrivateKey: string,
  toAddress: string,
  amount: string
): Promise<string> => {
  try {
    const connection = createSolanaConnection();
    const lamports = Math.floor(Number(amount) * 1e9);

    if (isNaN(lamports) || lamports <= 0) {
      throw new Error("Invalid amount provided.");
    }

    const secretKey = bs58.decode(fromPrivateKey);
    const fromKeypair = Keypair.fromSecretKey(secretKey);
    const toPubkey = new PublicKey(toAddress);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey,
        lamports,
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      fromKeypair,
    ]);

    return signature;
  } catch (error) {
    console.error("Failed to send Solana transaction:", error);
    throw new Error("Solana transaction failed.");
  }
};

export const getSolanaHistory = async (
  address: string
): Promise<TxHistoryItem[]> => {
  try {
    const connection = createSolanaConnection();
    const pubkey = new PublicKey(address);
    const signatures = await connection.getSignaturesForAddress(pubkey, {
      limit: 10,
    });

    const transactions = await Promise.all(
      signatures.map(async (sig) => {
        try {
          const tx = await connection.getTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0,
          });
          if (!tx || !tx.meta) return null;

          const { transaction, meta } = tx;
          const accountKeys = transaction.message.getAccountKeys();

          const from = accountKeys.get(0)?.toBase58();
          const to = accountKeys.get(1)?.toBase58() ?? "Unknown recipient";

          const amount = (meta.preBalances[0] - meta.postBalances[0]) / 1e9;

          return {
            hash: sig.signature,
            from,
            to,
            amount: amount.toString(),
            timestamp: (tx.blockTime || 0) * 1000,
          };
        } catch (err) {
          console.warn(`Failed to process transaction ${sig.signature}`, err);
          return null;
        }
      })
    );

    return transactions
      .filter(Boolean)
      .sort((a, b) => b!.timestamp - a!.timestamp) as TxHistoryItem[];
  } catch (error) {
    console.error("Failed to fetch Solana transaction history:", error);
    throw new Error("Unable to fetch transaction history.");
  }
};

export const getSolanaBalance = async (address: string): Promise<string> => {
  try {
    const connection = createSolanaConnection();
    const pubkey = new PublicKey(address);
    const balance = await connection.getBalance(pubkey);
    return (balance / 1e9).toString();
  } catch (error) {
    console.error("Failed to fetch Solana balance:", error);
    throw new Error("Unable to fetch balance.");
  }
};
