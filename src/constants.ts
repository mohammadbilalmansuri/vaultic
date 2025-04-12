// Total steps required for each onboarding flow type
export const TOTAL_STEPS = {
  create: 6,
  import: 5,
} as const;

// Development flag
export const IS_DEV = process.env.NODE_ENV === "development";

// Helper to safely load required env variables
function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env variable: ${key}`);
  }
  return value;
}

// IndexedDB configuration
export const IndexedDB = {
  NAME: getEnvVariable("NEXT_PUBLIC_INDEXED_DB_NAME"),
  STORE_NAME: getEnvVariable("NEXT_PUBLIC_INDEXED_DB_STORE_NAME"),
  VERSION: parseInt(getEnvVariable("NEXT_PUBLIC_INDEXED_DB_VERSION"), 10),
};

// Alchemy API Key
export const ALCHEMY_API_KEY = getEnvVariable("NEXT_PUBLIC_ALCHEMY_API_KEY");

// Blockchain RPC URLs
export const RPC_URLs = {
  ethereum: {
    mainnet: getEnvVariable("NEXT_PUBLIC_ETH_MAINNET_RPC"),
    devnet: getEnvVariable("NEXT_PUBLIC_ETH_SEPOLIA_RPC"),
  },
  solana: {
    mainnet: getEnvVariable("NEXT_PUBLIC_SOLANA_MAINNET_RPC"),
    devnet: getEnvVariable("NEXT_PUBLIC_SOLANA_DEVNET_RPC"),
  },
} as const;

// Routes that require user authentication
export const AUTHENTICATED_ROUTES = new Set<string>(["/dashboard", "/account"]);

// Developer password
export const DEV_PASSWORD = getEnvVariable("NEXT_PUBLIC_DEV_PASSWORD");
