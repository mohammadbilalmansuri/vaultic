import { create } from "zustand";
import { IWalletState } from "@/types/walletStoreTypes";

const getWalletKey = (network: string, address: string) =>
  `${network}:${address}`;

export const useWalletStore = create<IWalletState>((set) => ({
  wallets: new Map(),

  setWallets: (wallets) => set({ wallets }),

  addWallet: (wallet) =>
    set((state) => {
      const key = getWalletKey(wallet.network, wallet.address);
      const updated = new Map(state.wallets);
      updated.set(key, wallet);
      return { wallets: updated };
    }),

  removeWallet: (network, address) =>
    set((state) => {
      const key = getWalletKey(network, address);
      const updated = new Map(state.wallets);
      updated.delete(key);
      return { wallets: updated };
    }),

  clearWallets: () => set({ wallets: new Map() }),

  updateWalletBalance: (network, address, balance) =>
    set((state) => {
      const key = getWalletKey(network, address);
      const updated = new Map(state.wallets);
      const wallet = updated.get(key);
      if (wallet) {
        updated.set(key, { ...wallet, balance });
      }
      return { wallets: updated };
    }),
}));
