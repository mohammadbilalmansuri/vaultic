import { ReactNode, Dispatch, SetStateAction, SVGProps, JSX } from "react";

import type { TNetwork } from "./constants";
export type { TNetwork } from "./constants";

export interface IChildren {
  children: ReactNode;
}

export type TIcon = (props: SVGProps<SVGSVGElement>) => JSX.Element;

export interface INotification {
  type?: "info" | "success" | "error";
  message: string;
  duration?: number;
}

export type TNetworkMode = "mainnet" | "devnet";
export type TWalletStatus = "checking" | "ready";
export interface IIndexes {
  inUse: number[];
  deleted: number[];
}

export interface INetworkAccount {
  address: string;
  privateKey: string;
  balance: string;
}
export type TAccount = Record<TNetwork, INetworkAccount>;
export type TAccounts = Record<number, TAccount>;
export type TUpdatedBalances = Record<TNetwork, string>;

export interface IStoredWalletData {
  readonly hashedPassword: string;
  readonly encryptedMnemonic: string;
  readonly indexes: IIndexes;
  readonly networkMode: TNetworkMode;
  readonly activeAccountIndex: number;
}

export interface IActivity {
  readonly signature: string;
  readonly from: string;
  readonly to: string;
  readonly amount: string;
  readonly timestamp: number;
  readonly network: string;
  readonly status: "success" | "failed";
  readonly type: "send" | "receive";
}

export type TSetupPath = "create" | "import";
export type TSetupStep = 1 | 2 | 3 | 4 | 5;
export type TSetupSetPath = Dispatch<SetStateAction<TSetupPath>>;
export type TSetupSetStep = Dispatch<SetStateAction<TSetupStep>>;

export type TSelectVariant = "inline" | "dropdown";
export type TSelectStyle = "default" | "input";
