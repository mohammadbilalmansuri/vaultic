import { create } from "zustand";

interface UserState {
  isAuthenticated: boolean;
  password: string;
  mnemonic: string;
  walletCounts: { eth: number; sol: number };
  setMnemonic: (mnemonic: string) => void;
  setUser: (
    mnemonic: string,
    password: string,
    walletCounts: { eth: number; sol: number }
  ) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  isAuthenticated: false,
  password: "",
  mnemonic: "",
  walletCounts: { eth: 0, sol: 0 },

  setMnemonic: (mnemonic) => set({ mnemonic }),

  setUser: (mnemonic, password, walletCounts) =>
    set({ isAuthenticated: true, mnemonic, password, walletCounts }),

  logout: () =>
    set({
      isAuthenticated: false,
      password: "",
      mnemonic: "",
      walletCounts: { eth: 0, sol: 0 },
    }),
}));
