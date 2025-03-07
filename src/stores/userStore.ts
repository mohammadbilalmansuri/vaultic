import { create } from "zustand";

export type TNetwork = "ethereum" | "solana";

export type TWalletCounts = {
  [K in TNetwork]: number;
};

interface UserState {
  authenticated: boolean;
  password: string;
  mnemonic: string;
  walletCounts: TWalletCounts;
  setState: (updates: Partial<Omit<UserState, "setState" | "logout">>) => void;
  logout: () => void;
  initUser: (data: Partial<UserState>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  authenticated: false,
  password: "",
  mnemonic: "",
  walletCounts: { ethereum: 0, solana: 0 },

  setState: (updates) => set((state) => ({ ...state, ...updates })),

  logout: () =>
    set({
      authenticated: false,
      password: "",
      mnemonic: "",
      walletCounts: { ethereum: 0, solana: 0 },
    }),

  initUser: ({ password, mnemonic, walletCounts }) =>
    set((state) => ({
      ...state,
      authenticated: true,
      password: password ?? state.password,
      mnemonic: mnemonic ?? state.mnemonic,
      walletCounts: walletCounts ?? state.walletCounts,
    })),
}));
