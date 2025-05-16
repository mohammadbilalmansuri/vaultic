import { create } from "zustand";
import { IIndexes, TNetworkMode } from "@/types";
import { IS_DEV } from "@/constants";

interface IWalletStore {
  walletExists: boolean;
  authenticated: boolean;
  password: string;
  mnemonic: string;
  indexes: IIndexes;
  networkMode: TNetworkMode;
  setWalletState: (updates: Partial<IWalletStore>) => void;
  clearWallet: () => void;
}

const getDefaultState = (): Omit<
  IWalletStore,
  "setWalletState" | "clearWallet"
> => ({
  walletExists: false,
  authenticated: false,
  password: "",
  mnemonic: "",
  indexes: {
    inUse: [],
    deleted: [],
  },
  networkMode: IS_DEV ? "devnet" : "mainnet",
});

const useWalletStore = create<IWalletStore>((set) => ({
  ...getDefaultState(),
  setWalletState: (updates) => set((state) => ({ ...state, ...updates })),
  clearWallet: () => set(() => getDefaultState()),
}));

export default useWalletStore;
