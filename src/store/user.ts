import { create } from "zustand";

interface UserState {
  isAuthenticated: boolean;
  mnemonic: string | null;
  walletCounts: { eth: number; sol: number } | null;
  setUser: (
    mnemonic: string,
    walletCounts: { eth: number; sol: number }
  ) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  isAuthenticated: false,
  mnemonic: null,
  walletCounts: null,

  setUser: (mnemonic, walletCounts) =>
    set({ isAuthenticated: true, mnemonic, walletCounts }),

  logout: () =>
    set({ isAuthenticated: false, mnemonic: null, walletCounts: null }),
}));
