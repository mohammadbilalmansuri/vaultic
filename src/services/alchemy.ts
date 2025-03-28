import { Alchemy, Network } from "alchemy-sdk";
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

// 🔹 Configure Alchemy SDK for Ethereum
const alchemyEth = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_GOERLI, // Change for mainnet
});

// 🔹 Configure Solana RPC Connection
const solanaConnection = new Connection(clusterApiUrl("devnet")); // Change for mainnet

// ✅ Get ETH Balance
export const getEthBalance = async (address: string) => {
  const balanceWei = await alchemyEth.core.getBalance(address);
  return Number(balanceWei) / 1e18; // Convert Wei to ETH
};

// ✅ Get SOL Balance
export const getSolBalance = async (address: string) => {
  const publicKey = new PublicKey(address);
  const balanceLamports = await solanaConnection.getBalance(publicKey);
  return balanceLamports / LAMPORTS_PER_SOL; // Convert Lamports to SOL
};

// ✅ Send ETH
export const sendEth = async (
  from: string,
  to: string,
  amount: number,
  privateKey: string
) => {
  // Use ethers.js or Alchemy SDK to sign and send the transaction
};

// ✅ Send SOL
export const sendSol = async (
  from: string,
  to: string,
  amount: number,
  secretKey: Uint8Array
) => {
  // Use Solana web3.js to sign and send the transaction
};
