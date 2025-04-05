import { ethers } from "ethers";
import { Alchemy, Network } from "alchemy-sdk";

export type EthereumTxHistoryItem = {
  hash: string;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
};

const ETH_RPC = process.env.NEXT_PUBLIC_ALCHEMY_ETH_RPC!;
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!;

const provider = new ethers.JsonRpcProvider(ETH_RPC);

const alchemy = new Alchemy({
  apiKey: ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA,
});

export const sendEthereum = async (
  privateKey: string,
  to: string,
  amount: string
): Promise<string> => {
  const wallet = new ethers.Wallet(privateKey, provider);
  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(amount),
  });
  await tx.wait();
  return tx.hash;
};

export const getEthereumHistory = async (
  address: string
): Promise<EthereumTxHistoryItem[]> => {
  const response = await alchemy.core.getAssetTransfers({
    fromBlock: "0x0",
    toAddress: address,
    category: ["external"] as any, // Explicitly cast to bypass type issue
    maxCount: 10,
  });

  return response.transfers.map((tx) => ({
    hash: tx.hash,
    from: tx.from,
    to: tx.to!,
    amount: ethers.formatEther(tx.value || "0"),
    timestamp: new Date(tx.blockNum || "").getTime(),
  }));
};

export const getEthereumBalance = async (address: string): Promise<string> => {
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance); // Convert wei to ETH
};
