import { ReactNode, Dispatch, SetStateAction, SVGProps, JSX } from "react";
import { NETWORKS } from "@/config";

// Global Types

export interface IChildren {
  children: ReactNode;
}

export type TIcon = (props: SVGProps<SVGSVGElement>) => JSX.Element;

// Notification Type

export type TNotificationType = "info" | "success" | "error";

export interface INotification {
  type?: TNotificationType;
  message: string;
  duration?: number;
}

// Network and Wallet Types

export type TNetwork = keyof typeof NETWORKS;

export type TNetworkMode = "mainnet" | "testnet";

export type TWalletStatus = "checking" | "ready";

export interface IIndexes {
  inUse: number[];
  deleted: number[];
}

export interface IStoredWalletData {
  readonly hashedPassword: string;
  readonly encryptedMnemonic: string;
  readonly indexes: IIndexes;
  readonly networkMode: TNetworkMode;
  readonly activeAccountIndex: number;
}

// Account Types

export interface INetworkAccount {
  address: string;
  privateKey: string;
  balance: string;
}

export type TAccount = Record<TNetwork, INetworkAccount>;

export type TAccounts = Record<number, TAccount>;

export type TUpdatedBalances = Record<TNetwork, string>;

// Transaction Types

export interface ITransaction {
  readonly network: TNetwork;
  readonly signature: string;
  readonly from: string;
  readonly to: string;
  readonly amount: string;
  readonly fee: string;
  readonly block: string;
  readonly timestamp: number;
  readonly status: "success" | "failed";
  readonly type: "in" | "out" | "self";
}

export type TTransactions = Record<TNetwork, ITransaction[]>;

// Network Functions Types

export type TResetConnectionFunction = () => void;

export type TIsValidAddressFunction = (address: string) => boolean;

export type TFetchBalanceFunction = (address: string) => Promise<string>;

export type TDeriveNetworkAccountFunction = (
  seed: Buffer,
  index: number
) => Promise<INetworkAccount>;

export type TFetchTransactionsFunction = (
  address: string
) => Promise<ITransaction[]>;

export type TSendTokensFunction = (
  fromPrivateKey: string,
  toAddress: string,
  amount: string
) => Promise<ITransaction>;

export type TGetExplorerUrlFunction = (
  type: "tx" | "address" | "block",
  networkMode: TNetworkMode,
  value: string
) => string;

export type TRequestAirdropFunction = (
  toAddress: string,
  amount: string
) => Promise<string>;

export type TNetworkFunctions = Readonly<
  Record<
    TNetwork,
    Readonly<{
      resetConnection: TResetConnectionFunction;
      isValidAddress: TIsValidAddressFunction;
      fetchBalance: TFetchBalanceFunction;
      deriveNetworkAccount: TDeriveNetworkAccountFunction;
      fetchTransactions: TFetchTransactionsFunction;
      sendTokens: TSendTokensFunction;
      getExplorerUrl: TGetExplorerUrlFunction;
    }>
  >
>;

// Wallet Setup Types

export type TSetupPath = "create" | "import";

export type TSetupStep = 1 | 2 | 3 | 4 | 5;

export type TSetupSetPath = Dispatch<SetStateAction<TSetupPath>>;

export type TSetupSetStep = Dispatch<SetStateAction<TSetupStep>>;

// UI and Component Types

export type TSelectVariant = "inline" | "dropdown";

export type TSelectStyle = "default" | "input";

export interface ITabContentProps {
  initialAnimationDelay?: number;
  showInitialAnimation?: boolean;
}

export type TTabs = Record<
  string,
  { icon?: TIcon; content: (props: ITabContentProps) => JSX.Element | null }
>;

export interface IGuide {
  title: string;
  content: ReactNode;
}
