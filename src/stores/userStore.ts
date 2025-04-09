import { create } from "zustand";

export type TNetwork = "ethereum" | "solana";

export type TIndexes = {
  network: TNetwork;
  index: number;
}[];

export type TNetworkMode = "mainnet" | "devnet";

interface UserState {
  authenticated: boolean;
  password: string;
  mnemonic: string;
  indexes: TIndexes;
  deletedIndexes: TIndexes;
  networkMode: TNetworkMode;
  setUserState: (updates: Partial<UserState>) => void;
  setUser: (data: Partial<UserState>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  authenticated: false,
  password: "",
  mnemonic: "",
  indexes: [],
  deletedIndexes: [],
  networkMode: "mainnet",

  setUserState: (updates) => set((state) => ({ ...state, ...updates })),

  setUser: ({ password, mnemonic, indexes }) =>
    set((state) => ({
      ...state,
      authenticated: true,
      password: password ?? state.password,
      mnemonic: mnemonic ?? state.mnemonic,
      indexes: indexes ?? state.indexes,
      deletedIndexes: state.deletedIndexes,
      networkMode: state.networkMode,
    })),

  clearUser: () =>
    set({
      authenticated: false,
      password: "",
      mnemonic: "",
      indexes: [],
      deletedIndexes: [],
      networkMode: "mainnet",
    }),
}));
