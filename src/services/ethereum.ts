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
import { ALCHEMY_API_KEY, TRANSACTION_LIMIT } from "@/constants";
import { ITransaction, INetworkAccount } from "@/types";
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

export const getEthereumBalance = async (address: string): Promise<string> => {
  if (!isValidEthereumAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }

  const provider = getEthereumProvider();
  const balance = await provider.getBalance(address);
  return formatEther(balance);
};

export const sendEthereum = async (
  fromPrivateKey: string,
  toAddress: string,
  amount: string
): Promise<ITransaction> => {
  if (!isValidEthereumAddress(toAddress)) {
    throw new Error("Invalid recipient address");
  }

  const provider = getEthereumProvider();
  const wallet = new Wallet(fromPrivateKey, provider);
  const value = parseEther(amount);

  const gasEstimate = await provider.estimateGas({
    to: toAddress,
    value: value,
    from: wallet.address,
  });

  const tx = await wallet.sendTransaction({ to: toAddress, value });
  const receipt = await tx.wait();
  if (!receipt) throw new Error("Transaction receipt not found");

  let timestamp = Date.now();

  return {
    network: "ethereum",
    signature: tx.hash,
    from: wallet.address,
    to: toAddress,
    amount: amount,
    block: receipt.blockNumber.toString(),
    fee: formatEther(receipt.gasUsed * receipt.gasPrice),
    timestamp,
    status: receipt.status === 1 ? "success" : "failed",
    type: "send",
  };
};

export const getEthereumTransactions = async (
  address: string
): Promise<ITransaction[]> => {
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
    maxCount: TRANSACTION_LIMIT,
    withMetadata: true,
  });

  if (transfers.length === 0) return [];

  const transactions: (ITransaction | null)[] = await Promise.all(
    transfers.map(async (tx) => {
      try {
        const [block, txDetails, receipt] = await Promise.all([
          provider.getBlock(tx.blockNum),
          provider.getTransaction(tx.hash),
          provider.getTransactionReceipt(tx.hash),
        ]);

        if (!block || !txDetails || !receipt || !tx.to) return null;

        return {
          network: "ethereum",
          signature: tx.hash,
          from: tx.from,
          to: tx.to,
          amount: tx.value ? formatEther(tx.value) : "0",
          block: tx.blockNum,
          fee:
            receipt && txDetails
              ? formatEther(receipt.gasUsed * (txDetails.gasPrice ?? 0))
              : "0",
          timestamp: block?.timestamp * 1000,
          status: receipt?.status === 1 ? "success" : "failed",
          type: address === tx.from ? "send" : "receive",
        };
      } catch (err) {
        console.warn(`Error processing Ethereum tx ${tx.hash}:`, err);
        return null;
      }
    })
  );

  return transactions
    .filter((tx): tx is ITransaction => tx !== null)
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const deriveEthereumAccount = async (
  seed: Buffer,
  index: number
): Promise<INetworkAccount> => {
  if (!seed || seed.length === 0) throw new Error("Seed cannot be empty");

  if (index < 0 || !Number.isInteger(index)) {
    throw new Error("Index must be a non-negative integer");
  }

  const path = `m/44'/60'/${index}'/0/0`;
  const hdNode = HDNodeWallet.fromSeed(seed);
  const child = hdNode.derivePath(path);

  const { address, privateKey } = child;
  const balance = await getEthereumBalance(address);

  return { address, privateKey, balance };
};
