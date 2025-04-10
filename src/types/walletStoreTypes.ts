import { TNetwork } from "./userStoreTypes";

export interface IWallet {
  network: TNetwork;
  address: string;
  privateKey: string;
  balance: number;
}

export interface IWalletState {
  wallets: Map<string, IWallet>;
  setWallets: (wallets: Map<string, IWallet>) => void;
  addWallet: (wallet: IWallet) => void;
  removeWallet: (network: TNetwork, address: string) => void;
  clearWallets: () => void;
  updateWalletBalance: (
    network: TNetwork,
    address: string,
    balance: number
  ) => void;
}
