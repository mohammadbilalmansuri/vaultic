import { INetworkFunctions, TNetworkMode } from "./types";
import {
  resetEthereumConnection,
  isValidEthereumAddress,
  fetchEthereumBalance,
  deriveEthereumAccount,
  fetchEthereumTransactions,
  sendEthereum,
  getEthereumExplorerUrl,
} from "@/services/ethereum";
import {
  resetSolanaConnection,
  isValidSolanaAddress,
  fetchSolanaBalance,
  deriveSolanaAccount,
  fetchSolanaTransactions,
  sendSolana,
  getSolanaExplorerUrl,
  requestSolanaAirdrop,
} from "@/services/solana";
import { Ethereum, Solana } from "./components/ui/icons";

// Development Flags

export const IS_DEV = process.env.NODE_ENV === "development";
export const DEV_PASSWORD = process.env.NEXT_PUBLIC_DEV_PASSWORD!;

// IndexedDB

export const INDEXED_DB = {
  NAME: process.env.NEXT_PUBLIC_INDEXED_DB_NAME!,
  STORE_NAME: process.env.NEXT_PUBLIC_INDEXED_DB_STORE_NAME!,
  VERSION: parseInt(process.env.NEXT_PUBLIC_INDEXED_DB_VERSION!),
} as const;

// Alchemy

export const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!;

// Blockchain Network Configurations

export const NETWORKS = {
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    token: "ETH",
    icon: Ethereum,
    testnetName: "Sepolia",
    decimals: 18,
    fee: "0.0001",
    rentExemption: "0",
    svgUrlForQR: "/ethereum.svg",
    rpc: {
      mainnet: process.env.NEXT_PUBLIC_ETH_MAINNET_RPC!,
      testnet: process.env.NEXT_PUBLIC_ETH_SEPOLIA_RPC!,
    },
    functions: {
      resetConnection: resetEthereumConnection,
      isValidAddress: isValidEthereumAddress,
      fetchBalance: fetchEthereumBalance,
      deriveNetworkAccount: deriveEthereumAccount,
      fetchTransactions: fetchEthereumTransactions,
      sendTokens: sendEthereum,
      getExplorerUrl: getEthereumExplorerUrl,
    } as INetworkFunctions,
  },
  solana: {
    id: "solana",
    name: "Solana",
    token: "SOL",
    icon: Solana,
    testnetName: "Devnet",
    decimals: 9,
    fee: "0.00008",
    rentExemption: "0.00089088",
    svgUrlForQR: "/solana.svg",
    rpc: {
      mainnet: process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC!,
      testnet: process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC!,
    },
    functions: {
      resetConnection: resetSolanaConnection,
      isValidAddress: isValidSolanaAddress,
      fetchBalance: fetchSolanaBalance,
      deriveNetworkAccount: deriveSolanaAccount,
      fetchTransactions: fetchSolanaTransactions,
      sendTokens: sendSolana,
      getExplorerUrl: getSolanaExplorerUrl,
      requestAirdrop: requestSolanaAirdrop,
    } as INetworkFunctions,
  },
} as const;

// Application Defaults

export const BALANCE_DISPLAY_DECIMALS = 4;

export const FAUCET_PRESET_AMOUNTS = ["0.5", "1", "2.5", "5"];

export const TRANSACTION_LIMIT = 10;
