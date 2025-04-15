import { create } from "zustand";
import { TNetworkMode, TIndexes } from "../types";
import { IS_DEV } from "@/constants";

interface IUserState {
  status: boolean;
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
  status: false,
  authenticated: false,
  password: "",
  mnemonic: "",
  indexes: [],
  deletedIndexes: [],
  networkMode: IS_DEV ? "devnet" : "mainnet",
});

const useUserStore = create<IUserState>((set) => ({
  ...getDefaultState(),

  setUserState: (updates) => set((state) => ({ ...state, ...updates })),

  setUser: (user) =>
    set((state) => ({
      ...state,
      ...user,
    })),

  clearUser: () => set(() => getDefaultState()),
}));

export default useUserStore;
