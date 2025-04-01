import { create } from "zustand";

export type TNetwork = "ethereum" | "solana";

export type TIndexes = {
  network: TNetwork;
  index: number;
}[];

interface UserState {
  authenticated: boolean;
  password: string;
  mnemonic: string;
  indexes: TIndexes;
  deletedIndexes: TIndexes;
  setState: (updates: Partial<UserState>) => void;
  logout: () => void;
  initUser: (data: Partial<UserState>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  authenticated: false,
  password: "",
  mnemonic: "",
  indexes: [],
  deletedIndexes: [],

  setState: (updates) => set((state) => ({ ...state, ...updates })),

  logout: () =>
    set({
      authenticated: false,
      password: "",
      mnemonic: "",
      indexes: [],
      deletedIndexes: [],
    }),

  initUser: ({ password, mnemonic, indexes }) =>
    set((state) => ({
      ...state,
      authenticated: true,
      password: password ?? state.password,
      mnemonic: mnemonic ?? state.mnemonic,
      indexes: indexes ?? state.indexes,
      deletedIndexes: state.deletedIndexes,
    })),
}));
