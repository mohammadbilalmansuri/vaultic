import { create } from "zustand";
import { TNetwork } from "./userStore";

export interface IWallet {
  index: number;
  network: TNetwork;
  address: string;
  privateKey: string;
  balance: number;
}

interface WalletState {
  wallets: IWallet[];
  setWallets: (wallets: IWallet[]) => void;
  addWallet: (wallet: IWallet) => void;
  removeWallet: (index: number, network: TNetwork) => void;
  clearWallets: () => void;
  updateWalletBalance: (
    index: number,
    network: TNetwork,
    balance: number
  ) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallets: [],

  setWallets: (wallets) => set({ wallets }),

  addWallet: (wallet) =>
    set((state) => ({
      wallets: [...state.wallets, wallet],
    })),

  removeWallet: (index, network) =>
    set((state) => ({
      wallets: state.wallets.filter(
        (w) => !(w.index === index && w.network === network)
      ),
    })),

  clearWallets: () => set({ wallets: [] }),

  updateWalletBalance: (index, network, balance) =>
    set((state) => ({
      wallets: state.wallets.map((w) =>
        w.index === index && w.network === network ? { ...w, balance } : w
      ),
    })),
}));
