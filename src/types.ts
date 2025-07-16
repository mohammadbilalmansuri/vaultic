import { JSX } from "react";
import type { ReactNode, Dispatch, SetStateAction, SVGProps } from "react";
import { NETWORKS } from "@/config";

// Global Types

export interface Children {
  children: ReactNode;
}

export type Icon = (props: SVGProps<SVGSVGElement>) => JSX.Element;

// Notification Type

export type NotificationType = "info" | "success" | "error";

export interface Notification {
  type?: NotificationType;
  message: string;
  duration?: number;
}

// Network and Wallet Types

export type Network = keyof typeof NETWORKS;

export type NetworkMode = "mainnet" | "testnet";

export type WalletStatus = "checking" | "ready";

export interface Indexes {
  inUse: number[];
  deleted: number[];
}

export interface StoredWalletData {
  readonly hashedPassword: string;
  readonly encryptedMnemonic: string;
  readonly indexes: Indexes;
  readonly networkMode: NetworkMode;
  readonly activeAccountIndex: number;
}

// Account Types

export interface NetworkAccount {
  address: string;
  privateKey: string;
  balance: string;
}

export type Account = Record<Network, NetworkAccount>;

export type Accounts = Record<number, Account>;

// Transaction Types

export interface Transaction {
  readonly network: Network;
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

export type Transactions = Record<Network, Transaction[]>;

// Network Functions Types

export type ResetConnectionFunction = () => void;

export type IsValidAddressFunction = (address: string) => boolean;

export type FetchBalanceFunction = (address: string) => Promise<string>;

export type DeriveNetworkAccountFunction = (
  seed: Buffer,
  index: number
) => Promise<NetworkAccount>;

export type FetchTransactionsFunction = (
  address: string
) => Promise<Transaction[]>;

export type SendTokensFunction = (
  fromPrivateKey: string,
  toAddress: string,
  amount: string
) => Promise<Transaction>;

export type GetExplorerUrlFunction = (
  type: "tx" | "address" | "block",
  networkMode: NetworkMode,
  value: string
) => string;

export type RequestAirdropFunction = (
  toAddress: string,
  amount: string
) => Promise<string>;

export type NetworkFunctions = Readonly<
  Record<
    Network,
    Readonly<{
      resetConnection: ResetConnectionFunction;
      isValidAddress: IsValidAddressFunction;
      fetchBalance: FetchBalanceFunction;
      deriveNetworkAccount: DeriveNetworkAccountFunction;
      fetchTransactions: FetchTransactionsFunction;
      sendTokens: SendTokensFunction;
      getExplorerUrl: GetExplorerUrlFunction;
    }>
  >
>;

// Wallet Setup Types

export type SetupPath = "create" | "import";

export type SetupStep = 1 | 2 | 3 | 4 | 5;

export type SetupSetPath = Dispatch<SetStateAction<SetupPath>>;

export type SetupSetStep = Dispatch<SetStateAction<SetupStep>>;

// UI and Component Types

export interface TabPanelProps {
  initialAnimationDelay?: number;
  showInitialAnimation?: boolean;
}

export type TabsData = Record<
  string,
  { icon?: Icon; panel: (props: TabPanelProps) => JSX.Element | null }
>;
