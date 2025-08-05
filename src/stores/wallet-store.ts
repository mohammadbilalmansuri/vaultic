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
  /**
   * Updates the wallet state with the given partial fields.
   * @param updates Partial state to merge with the existing wallet state.
   */
  setWalletState: (updates: Partial<WalletState>) => void;

  /**
   * Resets the wallet to its default state, preserving redirect suppression
   * and setting status to 'ready'.
   */
  clearWallet: () => void;
}

interface WalletStore extends WalletState {
  actions: WalletActions;
}

// Default wallet state
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

/* Zustand store hook for wallet state and actions. */
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

/** Returns the current wallet status such as 'checking', 'ready', or 'locked'. */
export const useWalletStatus = () =>
  useWalletStore((state) => state.walletStatus);

/** Indicates whether redirect behavior should be suppressed (e.g., after logout or reset). */
export const useSuppressRedirect = () =>
  useWalletStore((state) => state.suppressRedirect);

/** Returns whether a wallet has already been created or imported. */
export const useWalletExists = () =>
  useWalletStore((state) => state.walletExists);

/** Returns whether the user is currently authenticated. */
export const useAuthenticated = () =>
  useWalletStore((state) => state.authenticated);

/**
 * Returns the in-memory wallet password.
 * Cleared on logout or wallet reset.
 */
export const usePassword = () => useWalletStore((state) => state.password);

/**
 * Returns the mnemonic phrase used for wallet generation or recovery.
 *
 * ⚠️ Sensitive — handle with care.
 */
export const useMnemonic = () => useWalletStore((state) => state.mnemonic);

/** Returns wallet index data including active and deleted indexes. */
export const useIndexes = () => useWalletStore((state) => state.indexes);

/** Returns the currently selected network mode ('mainnet' or 'testnet'). */
export const useNetworkMode = () =>
  useWalletStore((state) => state.networkMode);

/**
 * Returns wallet actions for setting or clearing wallet state.
 */
export const useWalletActions = () => useWalletStore((state) => state.actions);

/**
 * Returns the full wallet state (non-reactive).
 * Use outside React render cycle (e.g., in event handlers or utils).
 */
export const getWalletState = () => useWalletStore.getState();
