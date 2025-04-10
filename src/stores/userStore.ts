import { create } from "zustand";
import { TNetworkMode, TIndexes } from "../types";

interface IUserState {
  authenticated: boolean;
  password: string;
  mnemonic: string;
  indexes: TIndexes;
  deletedIndexes: TIndexes;
  networkMode: TNetworkMode;
  setUserState: (updates: Partial<IUserState>) => void;
  setUser: (data: Partial<IUserState>) => void;
  clearUser: () => void;
}

const getDefaultState = (): Omit<
  IUserState,
  "setUserState" | "setUser" | "clearUser"
> => ({
  authenticated: false,
  password: "",
  mnemonic: "",
  indexes: [],
  deletedIndexes: [],
  networkMode: "mainnet",
});

const useUserStore = create<IUserState>((set) => ({
  ...getDefaultState(),

  setUserState: (updates) => {
    set((state) => ({ ...state, ...updates }));
  },

  setUser: (user) => {
    set((state) => ({
      ...state,
      authenticated: true,
      ...user,
    }));
  },

  clearUser: () => set(() => getDefaultState()),
}));

export default useUserStore;
