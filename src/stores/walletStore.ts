import { create } from "zustand";
import { IS_DEV } from "@/config";
import { IIndexes, TNetworkMode, TWalletStatus } from "@/types";

interface IWalletStore {
  walletStatus: TWalletStatus;
  suppressRedirect: boolean;
  walletExists: boolean;
  authenticated: boolean;
  password: string;
  mnemonic: string;
  indexes: IIndexes;
  networkMode: TNetworkMode;
  setWalletState: (updates: Partial<IWalletStore>) => void;
  clearWallet: () => void;
}

// Returns default wallet state
const getDefaultState = (): Omit<
  IWalletStore,
  "setWalletState" | "clearWallet"
> => ({
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
const useWalletStore = create<IWalletStore>((set) => ({
  ...getDefaultState(),

  setWalletState: (updates) => set((state) => ({ ...state, ...updates })),

  clearWallet: () =>
    set(() => ({
      ...getDefaultState(),
      suppressRedirect: true,
      walletStatus: "ready",
    })),
}));

export default useWalletStore;
