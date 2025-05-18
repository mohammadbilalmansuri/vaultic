export const IS_DEV = process.env.NODE_ENV === "development";

export const DEV_PASSWORD = process.env.NEXT_PUBLIC_DEV_PASSWORD!;

export const INDEXED_DB = {
  NAME: process.env.NEXT_PUBLIC_INDEXED_DB_NAME!,
  STORE_NAME: process.env.NEXT_PUBLIC_INDEXED_DB_STORE_NAME!,
  VERSION: parseInt(process.env.NEXT_PUBLIC_INDEXED_DB_VERSION!),
} as const;

export const RPC_URLs = {
  ethereum: {
    mainnet: process.env.NEXT_PUBLIC_ETH_MAINNET_RPC!,
    devnet: process.env.NEXT_PUBLIC_ETH_SEPOLIA_RPC!,
  },
  solana: {
    mainnet: process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC!,
    devnet: process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC!,
  },
} as const;

export const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!;

export const SETUP_STEPS = {
  create: 6,
  import: 5,
} as const;

export const NETWORK_TOKENS = {
  ethereum: "ETH",
  solana: "SOL",
} as const;

export const FAUCET_PRESET_AMOUNTS = ["0.5", "1", "2.5", "5"] as const;
