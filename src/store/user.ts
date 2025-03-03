import { create } from "zustand";

export type TNetwork = "eth" | "sol";

type WalletCounts = {
  [K in TNetwork]: number;
};

interface UserState {
  status: boolean;
  password: string;
  mnemonic: string;
  walletCounts: WalletCounts;
  setState: (updates: Partial<Omit<UserState, "setState">>) => void;
  logout: () => void;
  initUser: (data: Partial<UserState>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  status: false,
  password: "",
  mnemonic: "",
  walletCounts: { eth: 0, sol: 0 },

  setState: (updates) => set((state) => ({ ...state, ...updates })),

  logout: () =>
    set({
      status: false,
      password: "",
      mnemonic: "",
      walletCounts: { eth: 0, sol: 0 },
    }),

  initUser: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),
}));
