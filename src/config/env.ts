export const IS_DEV = process.env.NODE_ENV === "development";

export const DEV_PASSWORD = process.env.NEXT_PUBLIC_DEV_PASSWORD!;

export const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!;

export const INDEXED_DB = {
  NAME: process.env.NEXT_PUBLIC_INDEXED_DB_NAME!,
  STORE_NAME: process.env.NEXT_PUBLIC_INDEXED_DB_STORE_NAME!,
  VERSION: parseInt(process.env.NEXT_PUBLIC_INDEXED_DB_VERSION!),
} as const;
