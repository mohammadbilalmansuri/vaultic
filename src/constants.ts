const getEnvVariable = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

export const ONBOARDING_STEPS = {
  create: 6,
  import: 5,
} as const;

export const AUTHENTICATED_ROUTES = new Set<string>(["/dashboard", "/account"]);

export const IS_DEV = getEnvVariable("NODE_ENV") === "development";

export const DEV_PASSWORD = getEnvVariable("NEXT_PUBLIC_DEV_PASSWORD");

export const INDEXED_DB = {
  NAME: getEnvVariable("NEXT_PUBLIC_INDEXED_DB_NAME"),
  STORE_NAME: getEnvVariable("NEXT_PUBLIC_INDEXED_DB_STORE_NAME"),
  VERSION: parseInt(getEnvVariable("NEXT_PUBLIC_INDEXED_DB_VERSION")),
} as const;

export const ALCHEMY_API_KEY = getEnvVariable("NEXT_PUBLIC_ALCHEMY_API_KEY");

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
