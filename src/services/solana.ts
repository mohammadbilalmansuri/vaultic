import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";

export type TxHistoryItem = {
  hash: string;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
};

const SOLANA_RPC = "https://api.devnet.solana.com";
// const SOLANA_RPC = "https://api.mainnet-beta.solana.com";

export const sendSolana = async (
  fromPrivateKey: string,
  toAddress: string,
  amount: string
): Promise<string> => {
  const connection = new Connection(SOLANA_RPC);
  const secretKey = bs58.decode(fromPrivateKey);
  const fromKeypair = Keypair.fromSecretKey(secretKey);
  const toPubkey = new PublicKey(toAddress);

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey,
      lamports: parseFloat(amount) * 1e9, // SOL to lamports
    })
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    fromKeypair,
  ]);
  return signature;
};

export const getSolanaHistory = async (
  address: string
): Promise<TxHistoryItem[]> => {
  const connection = new Connection(SOLANA_RPC);
  const pubkey = new PublicKey(address);
  const signatures = await connection.getSignaturesForAddress(pubkey, {
    limit: 10,
  });

  const transactions = await Promise.all(
    signatures.map(async (sig) => {
      const tx = await connection.getTransaction(sig.signature, {
        maxSupportedTransactionVersion: 0,
      });
      if (!tx || !tx.meta) return null;

      const { transaction, meta } = tx;
      const accountKeys = transaction.message.getAccountKeys();
      const from = accountKeys.get(0)?.toBase58();
      const to = accountKeys.get(1)?.toBase58();
      const amount = (meta.preBalances[0] - meta.postBalances[0]) / 1e9;

      return {
        hash: sig.signature,
        from,
        to,
        amount: amount.toString(),
        timestamp: (tx.blockTime || 0) * 1000,
      };
    })
  );

  return transactions.filter(Boolean) as TxHistoryItem[];
};

export const getSolanaBalance = async (address: string): Promise<string> => {
  const connection = new Connection(SOLANA_RPC);
  const pubkey = new PublicKey(address);
  const balance = await connection.getBalance(pubkey);
  return (balance / 1e9).toString(); // Convert lamports to SOL
};
