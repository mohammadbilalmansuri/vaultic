import { Ethereum, Solana } from "./components/ui/icons";

// === Environment Flags ===

export const IS_DEV = process.env.NODE_ENV === "development";
export const DEV_PASSWORD = process.env.NEXT_PUBLIC_DEV_PASSWORD!;

// === IndexedDB Config ===

export const INDEXED_DB = {
  NAME: process.env.NEXT_PUBLIC_INDEXED_DB_NAME!,
  STORE_NAME: process.env.NEXT_PUBLIC_INDEXED_DB_STORE_NAME!,
  VERSION: parseInt(process.env.NEXT_PUBLIC_INDEXED_DB_VERSION!),
} as const;

// === Supported Networks ===

export const NETWORKS = {
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    token: "ETH",
    icon: Ethereum,
    testnetName: "Sepolia",
    rpc: {
      mainnet: process.env.NEXT_PUBLIC_ETH_MAINNET_RPC!,
      devnet: process.env.NEXT_PUBLIC_ETH_SEPOLIA_RPC!,
    },
  },
  solana: {
    id: "solana",
    name: "Solana",
    token: "SOL",
    icon: Solana,
    testnetName: "Devnet",
    rpc: {
      mainnet: process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC!,
      devnet: process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC!,
    },
  },
} as const;

export type TNetwork = keyof typeof NETWORKS;

// === App Config ===

export const BALANCE_DECIMALS = 4 as const;

export const FAUCET_PRESET_AMOUNTS = ["0.5", "1", "2.5", "5"] as const;
