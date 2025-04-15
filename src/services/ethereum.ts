import { ethers } from "ethers";
import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk";
import { ITxHistoryItem } from "@/types";
import getRpcUrl from "@/utils/getRpcUrl";
import useUserStore from "@/stores/userStore";
import { ALCHEMY_API_KEY } from "@/constants";
import formatBalance from "@/utils/formatBalance";

let ethereumProvider: ethers.JsonRpcProvider | null = null;
let alchemyInstance: Alchemy | null = null;

const getEthereumProvider = (): ethers.JsonRpcProvider => {
  if (!ethereumProvider) {
    const rpc = getRpcUrl("ethereum");
    ethereumProvider = new ethers.JsonRpcProvider(rpc);
  }
  return ethereumProvider;
};

const getAlchemyInstance = (): Alchemy => {
  if (!alchemyInstance) {
    const { networkMode } = useUserStore.getState();
    alchemyInstance = new Alchemy({
      apiKey: ALCHEMY_API_KEY,
      network:
        networkMode === "mainnet" ? Network.ETH_MAINNET : Network.ETH_SEPOLIA,
    });
  }
  return alchemyInstance;
};

export const resetEthereumConnection = () => {
  ethereumProvider = null;
  alchemyInstance = null;
};

export const sendEthereum = async (
  privateKey: string,
  to: string,
  amount: string
): Promise<string> => {
  try {
    if (!ethers.isAddress(to)) throw new Error("Invalid recipient address");

    const provider = getEthereumProvider();
    const wallet = new ethers.Wallet(privateKey, provider);
    const value = ethers.parseEther(amount);

    const tx = await wallet.sendTransaction({ to, value });
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error sending Ethereum:", error);
    throw error;
  }
};

export const getEthereumBalance = async (address: string): Promise<string> => {
  try {
    if (!ethers.isAddress(address)) throw new Error("Invalid Ethereum address");

    const provider = getEthereumProvider();
    const balance = await provider.getBalance(address);
    return formatBalance(ethers.formatEther(balance));
  } catch (error) {
    console.error("Error fetching Ethereum balance:", error);
    throw error;
  }
};

export const getEthereumHistory = async (
  address: string
): Promise<ITxHistoryItem[]> => {
  try {
    if (!ethers.isAddress(address)) throw new Error("Invalid Ethereum address");

    const alchemy = getAlchemyInstance();
    const provider = getEthereumProvider();
    const latestBlock = await provider.getBlockNumber();

    const { transfers } = await alchemy.core.getAssetTransfers({
      fromBlock: ethers.toBeHex(latestBlock - 10000),
      toAddress: address,
      category: [AssetTransfersCategory.EXTERNAL],
      maxCount: 20,
      withMetadata: true,
    });

    const result = await Promise.all(
      transfers.map(async (tx) => {
        const block = await provider.getBlock(tx.blockNum);
        return {
          hash: tx.hash,
          from: tx.from,
          to: tx.to!,
          amount: tx.value ? formatBalance(ethers.formatEther(tx.value)) : "0",
          timestamp: (block?.timestamp || 0) * 1000,
        };
      })
    );

    return result;
  } catch (error) {
    console.error("Error fetching Ethereum history:", error);
    throw error;
  }
};
