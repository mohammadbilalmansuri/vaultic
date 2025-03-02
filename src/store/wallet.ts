import { create } from "zustand";

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
  clearWallets: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallets: [],

  setWallets: (wallets) => set({ wallets }),

  clearWallets: () => set({ wallets: [] }),
}));
