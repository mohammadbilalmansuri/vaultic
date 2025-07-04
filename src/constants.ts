import { UseInViewOptions } from "motion/react";
import { TNetwork } from "./types";

export const DEFAULT_NETWORK: TNetwork = "ethereum";

export const BALANCE_DISPLAY_DECIMALS = 4;

export const FAUCET_PRESET_AMOUNTS = ["0.5", "1", "2.5", "5"];

export const TRANSACTION_LIMIT = 10;

export const IN_VIEW_OPTIONS: UseInViewOptions = {
  once: true,
  margin: "0px 0px -10% 0px",
} as const;
