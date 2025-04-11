export const INDEXED_DB_NAME = process.env.NEXT_PUBLIC_INDEXED_DB_NAME!;
export const INDEXED_DB_STORE_NAME =
  process.env.NEXT_PUBLIC_INDEXED_DB_STORE_NAME!;
export const INDEXED_DB_VERSION = parseInt(
  process.env.NEXT_PUBLIC_INDEXED_DB_VERSION!
);

export const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!;

export const RPC_URLs = {
  ethereum: {
    mainnet: process.env.NEXT_PUBLIC_ETH_MAINNET_RPC!,
    devnet: process.env.NEXT_PUBLIC_ETH_SEPOLIA_RPC!,
  },
  solana: {
    mainnet: process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC!,
    devnet: process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC!,
  },
};

export const AUTHENTICATED_ROUTES = new Set(["/dashboard", "/account"]);
export const IS_DEV = process.env.NODE_ENV === "development";
export const DEV_PASSWORD = "12345678";
