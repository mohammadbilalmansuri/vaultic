import { create } from "zustand";

export type TNetwork = "ethereum" | "solana";

export type TWalletCounts = {
  [K in TNetwork]: number;
};

interface UserState {
  status: boolean;
  password: string;
  mnemonic: string;
  walletCounts: TWalletCounts;
  setState: (updates: Partial<Omit<UserState, "setState" | "logout">>) => void;
  logout: () => void;
  initUser: (data: Partial<UserState>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  status: false,
  password: "",
  mnemonic: "",
  walletCounts: { ethereum: 0, solana: 0 },

  setState: (updates) => set((state) => ({ ...state, ...updates })),

  logout: () =>
    set({
      status: false,
      password: "",
      mnemonic: "",
      walletCounts: { ethereum: 0, solana: 0 },
    }),

  initUser: (data) =>
    set((state) => ({
      ...state,
      status: data.status ?? state.status,
      password: data.password ?? state.password,
      mnemonic: data.mnemonic ?? state.mnemonic,
      walletCounts: data.walletCounts ?? state.walletCounts,
    })),
}));
