import { create } from "zustand";
import { TNetwork } from "./userStore";

interface Wallet {
  index: number;
  address: string;
  privateKey: string;
  balance?: number;
  network: TNetwork;
}

interface WalletState {
  wallets: Wallet[];
  setWallets: (wallets: Wallet[]) => void;
  addWallet: (wallet: Wallet) => void;
  removeWallet: (index: number) => void;
  clearWallets: () => void;
  updateWalletBalance: (index: number, balance: number) => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  wallets: [],

  setWallets: (wallets) => {
    set({ wallets });
  },

  addWallet: (wallet) =>
    set((state) => {
      const newWallets = [...state.wallets, wallet];
      return { wallets: newWallets };
    }, false),

  removeWallet: (index) =>
    set((state) => {
      const newWallets = state.wallets.filter((w) => w.index !== index);
      return { wallets: newWallets };
    }, false),

  clearWallets: () => set(() => ({ wallets: [] }), false),

  updateWalletBalance: (index, balance) =>
    set((state) => {
      const newWallets = state.wallets.map((w) =>
        w.index === index ? { ...w, balance } : w
      );
      return { wallets: newWallets };
    }, false),
}));
