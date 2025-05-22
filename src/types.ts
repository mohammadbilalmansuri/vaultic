import { ReactNode, Dispatch, SetStateAction } from "react";

export interface LayoutProps {
  children: ReactNode;
}

export interface INotification {
  type?: "info" | "success" | "error";
  message: string;
  duration?: number;
}

export type TWalletStatus = "checking" | "ready";

export type TNetwork = "ethereum" | "solana";

export type TNetworkMode = "mainnet" | "devnet";

export interface IIndexes {
  inUse: number[];
  deleted: number[];
}

export interface TNetworkAccount {
  address: string;
  privateKey: string;
  balance: string;
}

export type TAccount = Record<TNetwork, TNetworkAccount>;

export type TAccounts = Record<number, TAccount>;

export type TUpdatedBalances = Record<TNetwork, string>;

export interface IStoredWalletData {
  readonly hashedPassword: string;
  readonly encryptedMnemonic: string;
  readonly indexes: IIndexes;
  readonly networkMode: TNetworkMode;
}

export interface ITxHistoryItem {
  readonly hash: string;
  readonly from: string;
  readonly to: string;
  readonly amount: string;
  readonly timestamp: number;
  readonly network: string;
  readonly status: "success" | "failed";
}

export type TSetupPath = "create" | "import";

export type TSetupStep = 1 | 2 | 3 | 4 | 5;

export type TSetupSetPath = Dispatch<SetStateAction<TSetupPath>>;

export type TSetupSetStep = Dispatch<SetStateAction<TSetupStep>>;
