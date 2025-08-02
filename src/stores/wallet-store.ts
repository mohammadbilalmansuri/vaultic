import { create } from "zustand";
import { IS_DEV } from "@/config";
import type { Indexes, NetworkMode, WalletStatus } from "@/types";

interface WalletState {
  walletStatus: WalletStatus;
  suppressRedirect: boolean;
  walletExists: boolean;
  authenticated: boolean;
  password: string;
  mnemonic: string;
  indexes: Indexes;
  networkMode: NetworkMode;
}

interface WalletActions {
  setWalletState: (updates: Partial<WalletState>) => void;
  clearWallet: () => void;
}

interface WalletStore extends WalletState {
  actions: WalletActions;
}

const getDefaultState = (): WalletState => ({
  walletStatus: "checking",
  suppressRedirect: false,
  walletExists: false,
  authenticated: false,
  password: "",
  mnemonic: "",
  indexes: { inUse: [], deleted: [] },
  networkMode: IS_DEV ? "testnet" : "mainnet",
});

/**
 * Wallet store for managing authentication state, wallet data, and network configuration.
 * Handles wallet lifecycle from setup to authentication and account management.
 */
const useWalletStore = create<WalletStore>((set) => ({
  ...getDefaultState(),

  actions: {
    setWalletState: (updates) => set((state) => ({ ...state, ...updates })),

    clearWallet: () =>
      set(() => ({
        ...getDefaultState(),
        suppressRedirect: true,
        walletStatus: "ready",
      })),
  },
}));

export const useWalletStatus = () =>
  useWalletStore((state) => state.walletStatus);

export const useSuppressRedirect = () =>
  useWalletStore((state) => state.suppressRedirect);

export const useWalletExists = () =>
  useWalletStore((state) => state.walletExists);

export const useAuthenticated = () =>
  useWalletStore((state) => state.authenticated);

export const usePassword = () => useWalletStore((state) => state.password);

export const useMnemonic = () => useWalletStore((state) => state.mnemonic);

export const useIndexes = () => useWalletStore((state) => state.indexes);

export const useNetworkMode = () =>
  useWalletStore((state) => state.networkMode);

export const useWalletActions = () => useWalletStore((state) => state.actions);

export const getWalletState = () => useWalletStore.getState();
