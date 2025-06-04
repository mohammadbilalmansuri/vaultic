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
import { IActivity, INetworkAccount } from "@/types";
import { useWalletStore } from "@/stores";
import getRpcUrl from "@/utils/getRpcUrl";

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
  return formatEther(balance);
};

export const getEthereumActivity = async (
  address: string
): Promise<IActivity[]> => {
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

  const transactions: (IActivity | null)[] = await Promise.all(
    transfers.map(async (tx) => {
      try {
        const block = await provider.getBlock(tx.blockNum);

        return {
          signature: tx.hash,
          from: tx.from,
          to: tx.to!,
          amount: tx.value ? formatEther(tx.value) : "0",
          timestamp: (block?.timestamp ?? 0) * 1000,
          network: "ethereum",
          status: tx.category === "external" ? "success" : "failed",
          type: address === tx.from ? "send" : "receive",
        };
      } catch (err) {
        console.warn(`Error processing Ethereum tx ${tx.hash}`, err);
        return null;
      }
    })
  );

  return transactions
    .filter((tx): tx is IActivity => tx !== null)
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const deriveEthereumAccount = async (
  seed: Buffer,
  index: number
): Promise<INetworkAccount> => {
  const path = `m/44'/60'/${index}'/0/0`;
  const hdNode = HDNodeWallet.fromSeed(seed);
  const child = hdNode.derivePath(path);

  const { address, privateKey } = child;
  const balance = await getEthereumBalance(child.address);

  return { address, privateKey, balance };
};
