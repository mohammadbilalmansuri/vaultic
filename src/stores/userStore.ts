import { create } from "zustand";
import { IUserState } from "@/types/userStoreTypes";

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

export const useUserStore = create<IUserState>((set) => ({
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
