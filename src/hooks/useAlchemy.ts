import { Alchemy, Network } from "alchemy-sdk";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  Keypair,
} from "@solana/web3.js";
import { ethers } from "ethers";
import { useUserStore } from "@/stores/userStore";

const useAlchemy = () => {
  const devnet = useUserStore((state) => state.devnet);

  // Updated network selection
  const ethNetwork = devnet ? Network.ETH_SEPOLIA : Network.ETH_MAINNET;
  const solNetwork = devnet
    ? clusterApiUrl("devnet")
    : clusterApiUrl("mainnet-beta");

  const alchemy = new Alchemy({
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "",
    network: ethNetwork,
  });
  const solanaConnection = new Connection(solNetwork, "confirmed");

  /**
   * Fetch Ethereum Balance
   */
  const getEthBalance = async (address: string): Promise<string> => {
    try {
      const balance = await alchemy.core.getBalance(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error("Error fetching ETH balance:", error);
      return "0";
    }
  };

  /**
   * Fetch Solana Balance
   */
  const getSolBalance = async (address: string): Promise<number> => {
    try {
      const balance = await solanaConnection.getBalance(new PublicKey(address));
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error("Error fetching SOL balance:", error);
      return 0;
    }
  };

  /**
   * Send Ethereum Transaction
   */
  const sendEthTransaction = async (
    privateKey: string,
    to: string,
    amount: string
  ): Promise<string | null> => {
    try {
      const wallet = new ethers.Wallet(privateKey, alchemy.core);
      const tx = await wallet.sendTransaction({
        to,
        value: ethers.utils.parseEther(amount),
      });

      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error("Error sending ETH transaction:", error);
      return null;
    }
  };

  /**
   * Send Solana Transaction
   */
  const sendSolTransaction = async (
    privateKey: Uint8Array,
    to: string,
    amount: number
  ): Promise<string | null> => {
    try {
      const fromKeypair = Keypair.fromSecretKey(privateKey);
      const toPubKey = new PublicKey(to);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: toPubKey,
          lamports: amount * 1e9, // Convert SOL to lamports
        })
      );

      const signature = await sendAndConfirmTransaction(
        solanaConnection,
        transaction,
        [fromKeypair]
      );
      return signature;
    } catch (error) {
      console.error("Error sending SOL transaction:", error);
      return null;
    }
  };

  return {
    getEthBalance,
    getSolBalance,
    sendEthTransaction,
    sendSolTransaction,
  };
};

export default useAlchemy;
