import {
  HDNodeWallet,
  JsonRpcProvider,
  Wallet,
  isAddress,
  parseEther,
  formatEther,
} from "ethers";
import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk";
import { ALCHEMY_API_KEY } from "@/config";
import { TRANSACTION_LIMIT } from "@/constants";
import {
  Transaction,
  ResetConnectionFunction,
  IsValidAddressFunction,
  FetchBalanceFunction,
  DeriveNetworkAccountFunction,
  FetchTransactionsFunction,
  SendTokensFunction,
  GetExplorerUrlFunction,
} from "@/types";
import { useWalletStore } from "@/stores";
import getRpcUrl from "@/utils/getRpcUrl";

let ethereumProvider: JsonRpcProvider | null = null;
let alchemyInstance: Alchemy | null = null;

// Creates and caches Ethereum JSON-RPC provider
const getEthereumProvider = (): JsonRpcProvider => {
  if (!ethereumProvider) {
    const rpcUrl = getRpcUrl("ethereum");
    ethereumProvider = new JsonRpcProvider(rpcUrl);
  }
  return ethereumProvider;
};

// Creates and caches Alchemy SDK instance for enhanced APIs
const getAlchemyInstance = (): Alchemy => {
  if (!alchemyInstance) {
    const { networkMode } = useWalletStore.getState();
    const alchemyNetwork =
      networkMode === "mainnet" ? Network.ETH_MAINNET : Network.ETH_SEPOLIA;

    alchemyInstance = new Alchemy({
      apiKey: ALCHEMY_API_KEY,
      network: alchemyNetwork,
    });
  }
  return alchemyInstance;
};

// Calculates transaction fee from gas used and gas price
const getEthereumTransactionFee = (
  gasUsed: bigint,
  gasPrice: bigint
): string => {
  return formatEther(gasUsed * gasPrice);
};

/**
 * Resets Ethereum provider and Alchemy instance connections.
 * Used when switching network mode or refreshing connections.
 */
export const resetEthereumConnection: ResetConnectionFunction = () => {
  ethereumProvider = null;
  alchemyInstance = null;
};

/**
 * Validates if a string is a valid Ethereum address.
 * @param address - Address string to validate
 * @returns True if address is valid Ethereum format
 */
export const isValidEthereumAddress: IsValidAddressFunction = (address) => {
  return isAddress(address);
};

/**
 * Fetches ETH balance for a given address.
 * @param address - Ethereum address to check balance
 * @returns Balance in ETH as string
 */
export const fetchEthereumBalance: FetchBalanceFunction = async (address) => {
  if (!isValidEthereumAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }

  const provider = getEthereumProvider();
  const balance = await provider.getBalance(address);

  return formatEther(balance);
};

/**
 * Derives Ethereum account from HD wallet seed at specified index.
 * @param seed - HD wallet seed buffer
 * @param index - Derivation path index
 * @returns Account object with address, private key, and balance
 */
export const deriveEthereumAccount: DeriveNetworkAccountFunction = async (
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

/**
 * Fetches transaction history for an Ethereum address.
 * @param address - Ethereum address to fetch transactions for
 * @returns Array of formatted transaction objects
 */
export const fetchEthereumTransactions: FetchTransactionsFunction = async (
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
    .filter((txn) => txn.metadata?.blockTimestamp)
    .sort(
      (a, b) =>
        new Date(b.metadata!.blockTimestamp).getTime() -
        new Date(a.metadata!.blockTimestamp).getTime()
    )
    .slice(0, TRANSACTION_LIMIT);

  const transactions: (Transaction | null)[] = await Promise.all(
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
          from,
          to,
          amount: txDetails.value ? formatEther(txDetails.value) : "0",
          fee: getEthereumTransactionFee(
            receipt.gasUsed,
            receipt.gasPrice ?? txDetails.gasPrice ?? 0n
          ),
          timestamp: new Date(metadata.blockTimestamp).getTime(),
          block: receipt.blockNumber.toString(),
          status: receipt.status === 1 ? "success" : "failed",
          type:
            from.toLowerCase() === to.toLowerCase()
              ? "self"
              : from.toLowerCase() === address.toLowerCase()
              ? "out"
              : "in",
        };
      } catch (err) {
        console.warn(`Error processing Ethereum txn ${hash}:`, err);
        return null;
      }
    })
  );

  return transactions
    .filter((txn): txn is Transaction => txn !== null)
    .sort((a, b) => b.timestamp - a.timestamp);
};

/**
 * Sends ETH from one address to another.
 * @param fromPrivateKey - Sender's private key
 * @param toAddress - Recipient's Ethereum address
 * @param amount - Amount to send in ETH
 * @returns Transaction object with details
 */
export const sendEthereum: SendTokensFunction = async (
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

  const txn = await wallet.sendTransaction({
    to: toAddress,
    value: amountInWei,
  });

  const receipt = await txn.wait();

  if (!receipt) throw new Error("Transaction failed or no receipt");

  return {
    timestamp: Date.now(),
    network: "ethereum",
    signature: txn.hash,
    from: wallet.address,
    to: toAddress,
    amount,
    fee: getEthereumTransactionFee(
      receipt.gasUsed,
      receipt.gasPrice ?? txn.gasPrice ?? 0n
    ),
    block: receipt.blockNumber.toString(),
    status: receipt.status === 1 ? "success" : "failed",
    type: "out",
  };
};

/**
 * Generates Etherscan explorer URL for transactions, addresses, or blocks.
 * @param type - Type of explorer link (tx, address, block)
 * @param networkMode - Network mode (mainnet/testnet)
 * @param value - Hash, address, or block number
 * @returns Etherscan URL string
 */
export const getEthereumExplorerUrl: GetExplorerUrlFunction = (
  type,
  networkMode,
  value
) => {
  return `https://${
    networkMode === "testnet" ? "sepolia." : ""
  }etherscan.io/${type}/${value}`;
};
