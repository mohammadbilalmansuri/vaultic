export type TNetwork = "ethereum" | "solana";

export type TNetworkMode = "mainnet" | "devnet";

export type TIndexes = {
  network: TNetwork;
  index: number;
}[];

export interface IWallet {
  network: TNetwork;
  address: string;
  privateKey: string;
  balance: number;
}

export interface INotification {
  message: string;
  type: "info" | "success" | "error";
}

export type TxHistoryItem = {
  hash: string;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
};
