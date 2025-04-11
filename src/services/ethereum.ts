import { ethers } from "ethers";
import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk";
import { TxHistoryItem } from "@/types";
import getRpcUrl from "@/utils/getRpcUrl";
import useUserStore from "@/stores/userStore";
import { ALCHEMY_API_KEY } from "@/constants";

let provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(
  getRpcUrl("ethereum")
);

let alchemy: Alchemy = new Alchemy({
  apiKey: ALCHEMY_API_KEY,
  network:
    useUserStore.getState().networkMode === "mainnet"
      ? Network.ETH_MAINNET
      : Network.ETH_SEPOLIA,
});

export const resetEthereumConnection = () => {
  provider = new ethers.JsonRpcProvider(getRpcUrl("ethereum"));
  alchemy = new Alchemy({
    apiKey: ALCHEMY_API_KEY,
    network:
      useUserStore.getState().networkMode === "mainnet"
        ? Network.ETH_MAINNET
        : Network.ETH_SEPOLIA,
  });
};

export const sendEthereum = async (
  privateKey: string,
  to: string,
  amount: string
): Promise<string> => {
  try {
    if (!ethers.isAddress(to)) {
      throw new Error("Invalid recipient address.");
    }

    const value = ethers.parseEther(amount);
    const wallet = new ethers.Wallet(privateKey, provider);
    const tx = await wallet.sendTransaction({ to, value });
    await tx.wait();
    return tx.hash;
  } catch (error) {
    throw new Error(
      `Failed to send Ethereum: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const getEthereumHistory = async (
  address: string
): Promise<TxHistoryItem[]> => {
  try {
    if (!ethers.isAddress(address)) {
      throw new Error("Invalid Ethereum address.");
    }

    const { transfers } = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      toAddress: address,
      category: [AssetTransfersCategory.EXTERNAL],
      maxCount: 20,
      withMetadata: true,
    });

    const transfersWithTimestamps = await Promise.all(
      transfers.map(async (tx) => {
        const block = await provider.getBlock(tx.blockNum);
        return {
          hash: tx.hash,
          from: tx.from,
          to: tx.to!,
          amount: ethers.formatEther(tx.value || "0"),
          timestamp: (block?.timestamp || 0) * 1000,
        };
      })
    );

    return transfersWithTimestamps;
  } catch (error) {
    throw new Error(
      `Unable to fetch transaction history: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const getEthereumBalance = async (address: string): Promise<string> => {
  try {
    if (!ethers.isAddress(address)) {
      throw new Error("Invalid Ethereum address.");
    }
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    throw new Error(
      `Unable to fetch balance: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
