import { create } from "zustand";
import { TNetwork } from "./userStore";

interface Wallet {
  index: number;
  address: string;
  privateKey: string;
  balance: number;
  network: TNetwork;
}

interface WalletState {
  wallets: Wallet[];
  setWallets: (wallets: Wallet[]) => void;
  addWallet: (wallet: Wallet) => void;
  removeWallet: (index: number) => void;
  clearWallets: () => void;
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
    }, false), // Prevent re-render until updateWalletCounts is called

  removeWallet: (index) =>
    set((state) => {
      const newWallets = state.wallets.filter((w) => w.index !== index);
      return { wallets: newWallets };
    }, false),

  clearWallets: () =>
    set(() => {
      return { wallets: [] };
    }, false),
}));
