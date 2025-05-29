import {
  ethers,
  HDNodeWallet,
  JsonRpcProvider,
  Wallet,
  isAddress,
  parseEther,
  formatEther,
} from "ethers";
import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk";
import { ALCHEMY_API_KEY } from "@/constants";
import { ITxHistoryItem, TNetworkAccount } from "@/types";
import { useWalletStore } from "@/stores";
import getRpcUrl from "@/utils/getRpcUrl";
import { formatBalance } from "@/utils/balance";

let ethereumProvider: JsonRpcProvider | null = null;
let alchemyInstance: Alchemy | null = null;

const getEthereumProvider = (): JsonRpcProvider => {
  if (!ethereumProvider) {
    const rpc = getRpcUrl("ethereum");
    ethereumProvider = new JsonRpcProvider(rpc);
  }
  return ethereumProvider;
};

const getAlchemyInstance = (): Alchemy => {
  if (!alchemyInstance) {
    const { networkMode } = useWalletStore.getState();
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

export const isValidEthereumAddress = (address: string): boolean => {
  return isAddress(address);
};

export const sendEthereum = async (
  privateKey: string,
  toAddress: string,
  amount: string
): Promise<string> => {
  if (!isValidEthereumAddress(toAddress)) {
    throw new Error("Invalid recipient address");
  }

  const provider = getEthereumProvider();
  const wallet = new Wallet(privateKey, provider);
  const value = parseEther(amount);

  const tx = await wallet.sendTransaction({ to: toAddress, value });
  await tx.wait();

  return tx.hash;
};

export const getEthereumBalance = async (address: string): Promise<string> => {
  if (!isValidEthereumAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }

  const provider = getEthereumProvider();
  const balance = await provider.getBalance(address);
  return formatBalance(formatEther(balance));
};

export const getEthereumHistory = async (
  address: string
): Promise<ITxHistoryItem[]> => {
  if (!isValidEthereumAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }

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

  const transactions = await Promise.all(
    transfers.map(async (tx) => {
      try {
        const block = await provider.getBlock(tx.blockNum);

        return {
          hash: tx.hash,
          from: tx.from,
          to: tx.to!,
          amount: tx.value ? formatBalance(formatEther(tx.value)) : "0",
          timestamp: (block?.timestamp ?? 0) * 1000,
          network: "ethereum",
          status: tx.category === "external" ? "success" : "failed",
        };
      } catch (err) {
        console.warn(`Error processing Ethereum tx ${tx.hash}`, err);
        return null;
      }
    })
  );

  return transactions
    .filter((tx): tx is ITxHistoryItem => tx !== null)
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const deriveEthereumAccount = async (
  seed: Buffer,
  index: number
): Promise<TNetworkAccount> => {
  const path = `m/44'/60'/${index}'/0/0`;
  const hdNode = HDNodeWallet.fromSeed(seed);
  const child = hdNode.derivePath(path);

  const { address, privateKey } = child;
  const balance = await getEthereumBalance(child.address);

  return { address, privateKey, balance };
};
