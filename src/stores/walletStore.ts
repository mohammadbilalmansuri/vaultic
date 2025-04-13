import { create } from "zustand";
import { IWallet } from "@/types";

interface IWalletState {
  wallets: Map<string, IWallet>;
  setWallets: (wallets: Map<string, IWallet>) => void;
  addWallet: (wallet: IWallet) => void;
  removeWallet: (address: string) => void;
  clearWallets: () => void;
  updateWalletBalance: (address: string, balance: string) => void;
}

const useWalletStore = create<IWalletState>((set) => ({
  wallets: new Map(),

  setWallets: (wallets) => set({ wallets }),

  addWallet: (wallet) =>
    set((state) => {
      const updated = new Map(state.wallets);
      updated.set(wallet.address, wallet);
      return { wallets: updated };
    }),

  removeWallet: (address) =>
    set((state) => {
      const updated = new Map(state.wallets);
      updated.delete(address);
      return { wallets: updated };
    }),

  clearWallets: () => set({ wallets: new Map() }),

  updateWalletBalance: (address, balance) =>
    set((state) => {
      const updated = new Map(state.wallets);
      const wallet = updated.get(address);
      if (wallet) updated.set(address, { ...wallet, balance });
      return { wallets: updated };
    }),
}));

export default useWalletStore;
