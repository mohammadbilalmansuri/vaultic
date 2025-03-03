import { create } from "zustand";
import { useUserStore } from "./user";

const updateWalletCount = (wallets: Wallet[]) => {
  const ethCount = wallets.filter((w) => w.network === "ETH").length;
  const solCount = wallets.filter((w) => w.network === "SOL").length;
  useUserStore
    .getState()
    .setState({ walletCounts: { eth: ethCount, sol: solCount } });
};

interface Wallet {
  index: number;
  address?: string;
  publicKey?: string;
  privateKey: string;
  balance: number;
  network: "ETH" | "SOL";
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
    set({ wallets });
    updateWalletCount(wallets);
  },

  addWallet: (wallet) =>
    set((state) => {
      const newWallets = [...state.wallets, wallet];
      updateWalletCount(newWallets);
      return { wallets: newWallets };
    }),

  removeWallet: (index) =>
    set((state) => {
      const newWallets = state.wallets.filter((w) => w.index !== index);
      updateWalletCount(newWallets);
      return { wallets: newWallets };
    }),

  clearWallets: () => {
    set({ wallets: [] });
    useUserStore.getState().setState({ walletCounts: { eth: 0, sol: 0 } });
  },
}));
