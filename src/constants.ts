import { TNetwork } from "./types";

export const DEFAULT_NETWORK: TNetwork = "ethereum";

export const BALANCE_DISPLAY_DECIMALS = 4;

export const FAUCET_PRESET_AMOUNTS = ["0.5", "1", "2.5", "5"];

export const TRANSACTION_LIMIT = 10;

export const IN_VIEW_OPTIONS = {
  once: true,
  amount: 0.25,
} as const;
