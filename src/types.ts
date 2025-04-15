import { ReactNode } from "react";

export type TOnboardingStep = 1 | 2 | 3 | 4 | 5 | 6;

export type TOnboardingPath = "create" | "import" | null;

export type TNetwork = "ethereum" | "solana";

export type TNetworkMode = "mainnet" | "devnet";

export type TIndexes = {
  readonly network: TNetwork;
  readonly index: number;
}[];

export interface IWallet {
  readonly index: number;
  readonly network: TNetwork;
  readonly address: string;
  readonly privateKey: string;
  readonly balance: string;
}

export interface INotification {
  message: string | ReactNode;
  type?: "info" | "warning" | "success" | "error";
}

export interface ISavedUserData {
  readonly hashedPassword: string;
  readonly encryptedMnemonic: string;
  readonly indexes: TIndexes;
  readonly deletedIndexes: TIndexes;
  readonly networkMode: TNetworkMode;
}

export interface TTxHistoryItem {
  readonly hash: string;
  readonly from: string;
  readonly to: string;
  readonly amount: string;
  readonly timestamp: number;
}
