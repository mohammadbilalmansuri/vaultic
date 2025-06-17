import { TNetworkMode } from "./types";
import { Ethereum, Solana } from "./components/ui/icons";

export const IS_DEV = process.env.NODE_ENV === "development";
export const DEV_PASSWORD = process.env.NEXT_PUBLIC_DEV_PASSWORD!;

export const INDEXED_DB = {
  NAME: process.env.NEXT_PUBLIC_INDEXED_DB_NAME!,
  STORE_NAME: process.env.NEXT_PUBLIC_INDEXED_DB_STORE_NAME!,
  VERSION: parseInt(process.env.NEXT_PUBLIC_INDEXED_DB_VERSION!),
} as const;

export const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!;

export const NETWORKS = {
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    token: "ETH",
    icon: Ethereum,
    testnetName: "Sepolia",
    decimals: 18,
    fee: 0.0001,
    rentExemption: 0,
    rpc: {
      mainnet: process.env.NEXT_PUBLIC_ETH_MAINNET_RPC!,
      testnet: process.env.NEXT_PUBLIC_ETH_SEPOLIA_RPC!,
    },
    explorerUrl: (
      type: "tx" | "address",
      networkMode: TNetworkMode,
      value: string
    ) =>
      `https://${
        networkMode === "testnet" ? "sepolia." : ""
      }etherscan.io/${type}/${value}`,
    svg: "/ethereum.svg",
  },
  solana: {
    id: "solana",
    name: "Solana",
    token: "SOL",
    icon: Solana,
    testnetName: "Devnet",
    decimals: 9,
    fee: 0.00008,
    rentExemption: 0.00089088,
    rpc: {
      mainnet: process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC!,
      testnet: process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC!,
    },
    explorerUrl: (
      type: "tx" | "account",
      networkMode: TNetworkMode,
      value: string
    ) =>
      `https://solscan.io/${type}/${value}${
        networkMode === "testnet" ? "?cluster=devnet" : ""
      }`,
    svg: "/solana.svg",
  },
} as const;

export const BALANCE_DECIMALS = 4 as const;

export const FAUCET_PRESET_AMOUNTS = ["0.5", "1", "2.5", "5"];
