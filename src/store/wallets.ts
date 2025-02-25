"use client";

import { create } from "zustand";
import { setItem, getItem, deleteItem } from "@/utils/indexedDB";

interface Wallet {
  id: string;
  idx: number;
  name: string;
  balance: number;
  address: string;
  secret: string;
  createdAt: number;
  blockchain: "solana" | "ethereum";
}

interface WalletState {
  wallets: Wallet[];
  activeWallet: Wallet | null;
  addWallet: (wallet: Wallet) => Promise<void>;
  removeWallet: (id: string) => Promise<void>;
  setActiveWallet: (wallet: Wallet) => void;
  loadWallets: () => Promise<void>;
  updateWalletBalance: (id: string, balance: number) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallets: [],
  activeWallet: null,

  // ✅ Add a new wallet & store in IndexedDB
  addWallet: async (wallet) => {
    console.log("Adding wallet:", wallet);

    const existingWallets = (await getItem<Wallet[]>("wallets")) || [];
    const updatedWallets = [...existingWallets, wallet];

    await setItem("wallets", updatedWallets);
    set({ wallets: updatedWallets });
  },

  // ✅ Remove a wallet properly (Ensures IndexedDB updates correctly)
  removeWallet: async (id) => {
    console.log("Removing wallet:", id);

    const existingWallets = (await getItem<Wallet[]>("wallets")) || [];
    const updatedWallets = existingWallets.filter((w) => w.id !== id);

    await setItem("wallets", updatedWallets);
    set({ wallets: updatedWallets });

    // Reset active wallet if it's being removed
    set((state) => ({
      activeWallet: state.activeWallet?.id === id ? null : state.activeWallet,
    }));
  },

  // ✅ Set active wallet
  setActiveWallet: (wallet) => {
    console.log("Setting active wallet:", wallet);
    set({ activeWallet: wallet });
  },

  // ✅ Load wallets from IndexedDB
  loadWallets: async () => {
    console.log("Loading wallets...");

    const storedWallets = await getItem<Wallet[]>("wallets");
    console.log("Loaded wallets:", storedWallets);

    if (storedWallets) {
      set({ wallets: storedWallets });
    }
  },

  // ✅ Update wallet balance correctly
  updateWalletBalance: async (id, balance) => {
    console.log("Updating balance for wallet:", id, "to", balance);

    const existingWallets = (await getItem<Wallet[]>("wallets")) || [];
    const updatedWallets = existingWallets.map((wallet) =>
      wallet.id === id ? { ...wallet, balance } : wallet
    );

    await setItem("wallets", updatedWallets);
    set({ wallets: updatedWallets });

    // If updating the active wallet, reflect it in state
    set((state) => ({
      activeWallet:
        state.activeWallet?.id === id
          ? { ...state.activeWallet, balance }
          : state.activeWallet,
    }));
  },
}));
