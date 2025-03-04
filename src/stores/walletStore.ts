import { create } from "zustand";
import { useUserStore, TNetwork } from "./userStore";

interface Wallet {
  index: number;
  address?: string;
  publicKey?: string;
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

export const useWalletStore = create<WalletState>((set) => ({
  wallets: [],

  setWallets: (wallets) => {
    set(() => {
      const walletCounts = {
        eth: wallets.filter((w) => w.network === "eth").length,
        sol: wallets.filter((w) => w.network === "sol").length,
      };
      useUserStore.getState().setState({ walletCounts });
      return { wallets };
    });
  },

  addWallet: (wallet) =>
    set((state) => {
      const newWallets = [...state.wallets, wallet];
      const walletCounts = {
        eth: newWallets.filter((w) => w.network === "eth").length,
        sol: newWallets.filter((w) => w.network === "sol").length,
      };
      useUserStore.getState().setState({ walletCounts });
      return { wallets: newWallets };
    }),

  removeWallet: (index) =>
    set((state) => {
      const newWallets = state.wallets.filter((w) => w.index !== index);
      const walletCounts = {
        eth: newWallets.filter((w) => w.network === "eth").length,
        sol: newWallets.filter((w) => w.network === "sol").length,
      };
      useUserStore.getState().setState({ walletCounts });
      return { wallets: newWallets };
    }),

  clearWallets: () =>
    set(() => {
      useUserStore.getState().setState({ walletCounts: { eth: 0, sol: 0 } });
      return { wallets: [] };
    }),
}));
