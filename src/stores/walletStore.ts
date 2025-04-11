import { create } from "zustand";
import { TNetwork, IWallet } from "@/types";

interface IWalletState {
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

const getWalletKey = (network: string, address: string) =>
  `${network}:${address}`;

const useWalletStore = create<IWalletState>((set) => ({
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
      if (wallet) updated.set(key, { ...wallet, balance });
      return { wallets: updated };
    }),
}));

export default useWalletStore;
