import {
  HDNodeWallet,
  JsonRpcProvider,
  Wallet,
  isAddress,
  parseEther,
  formatEther,
} from "ethers";
import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk";
import { ALCHEMY_API_KEY, TRANSACTION_LIMIT } from "@/constants";
import {
  ITransaction,
  TResetConnectionFunction,
  TIsValidAddressFunction,
  TFetchBalanceFunction,
  TDeriveNetworkAccountFunction,
  TFetchTransactionsFunction,
  TSendFunction,
  TGetExplorerUrlFunction,
} from "@/types";
import { useWalletStore } from "@/stores";
import getRpcUrl from "@/utils/getRpcUrl";

let ethereumProvider: JsonRpcProvider | null = null;
let alchemyInstance: Alchemy | null = null;

const getEthereumProvider = (): JsonRpcProvider => {
  if (!ethereumProvider) {
    ethereumProvider = new JsonRpcProvider(getRpcUrl("ethereum"));
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

const getEthereumTransactionFee = (
  gasUsed: bigint,
  gasPrice: bigint
): string => {
  return formatEther(gasUsed * gasPrice);
};

export const resetEthereumConnection: TResetConnectionFunction = () => {
  ethereumProvider = null;
  alchemyInstance = null;
};

export const isValidEthereumAddress: TIsValidAddressFunction = (address) => {
  return isAddress(address);
};

export const fetchEthereumBalance: TFetchBalanceFunction = async (address) => {
  if (!isValidEthereumAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }
  const provider = getEthereumProvider();
  const balance = await provider.getBalance(address);
  return formatEther(balance);
};

export const deriveEthereumAccount: TDeriveNetworkAccountFunction = async (
  seed,
  index
) => {
  if (!seed?.length) throw new Error("Seed cannot be empty");
  if (index < 0 || !Number.isInteger(index)) {
    throw new Error("Index must be a non-negative integer");
  }

  const path = `m/44'/60'/${index}'/0/0`;
  const hdNode = HDNodeWallet.fromSeed(seed);
  const { address, privateKey } = hdNode.derivePath(path);
  const balance = await fetchEthereumBalance(address);

  return { address, privateKey, balance };
};

export const fetchEthereumTransactions: TFetchTransactionsFunction = async (
  address
) => {
  if (!isValidEthereumAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }

  const provider = getEthereumProvider();
  const alchemy = getAlchemyInstance();

  const [incoming, outgoing] = await Promise.all([
    alchemy.core.getAssetTransfers({
      toAddress: address,
      category: [AssetTransfersCategory.EXTERNAL],
      maxCount: TRANSACTION_LIMIT,
      withMetadata: true,
    }),
    alchemy.core.getAssetTransfers({
      fromAddress: address,
      category: [AssetTransfersCategory.EXTERNAL],
      maxCount: TRANSACTION_LIMIT,
      withMetadata: true,
    }),
  ]);

  const allTransfers = [...incoming.transfers, ...outgoing.transfers]
    .filter((tx) => tx.metadata?.blockTimestamp)
    .sort(
      (a, b) =>
        new Date(b.metadata!.blockTimestamp).getTime() -
        new Date(a.metadata!.blockTimestamp).getTime()
    )
    .slice(0, TRANSACTION_LIMIT);

  const transactions: (ITransaction | null)[] = await Promise.all(
    allTransfers.map(async ({ to, from, hash, metadata }) => {
      try {
        const [txDetails, receipt] = await Promise.all([
          provider.getTransaction(hash),
          provider.getTransactionReceipt(hash),
        ]);
        if (!txDetails || !receipt || !to) return null;

        return {
          network: "ethereum",
          signature: hash,
          from: from,
          to: to,
          amount: txDetails.value ? formatEther(txDetails.value) : "0",
          block: receipt.blockNumber.toString(),
          fee: getEthereumTransactionFee(
            receipt.gasUsed,
            receipt.gasPrice ?? txDetails.gasPrice ?? 0n
          ),
          timestamp: new Date(metadata.blockTimestamp).getTime(),
          status: receipt.status === 1 ? "success" : "failed",
          type:
            from.toLowerCase() === address.toLowerCase() ? "send" : "receive",
        };
      } catch (err) {
        console.warn(`Error processing Ethereum tx ${hash}:`, err);
        return null;
      }
    })
  );

  return transactions
    .filter((tx): tx is ITransaction => tx !== null)
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const sendEthereum: TSendFunction = async (
  fromPrivateKey,
  toAddress,
  amount
) => {
  if (!isValidEthereumAddress(toAddress)) {
    throw new Error("Invalid recipient address");
  }

  const provider = getEthereumProvider();
  const wallet = new Wallet(fromPrivateKey, provider);
  const amountInWei = parseEther(amount);

  const tx = await wallet.sendTransaction({
    to: toAddress,
    value: amountInWei,
  });
  const receipt = await tx.wait();

  if (!receipt) throw new Error("Transaction failed or no receipt");

  return {
    timestamp: Date.now(),
    network: "ethereum",
    signature: tx.hash,
    from: wallet.address,
    to: toAddress,
    amount,
    block: receipt.blockNumber.toString(),
    fee: getEthereumTransactionFee(
      receipt.gasUsed,
      receipt.gasPrice ?? tx.gasPrice ?? 0n
    ),
    status: receipt.status === 1 ? "success" : "failed",
    type: "send",
  };
};

export const getEthereumExplorerUrl: TGetExplorerUrlFunction = (
  type,
  networkMode,
  value
) => {
  return `https://${
    networkMode === "testnet" ? "sepolia." : ""
  }etherscan.io/${type}/${value}`;
};
