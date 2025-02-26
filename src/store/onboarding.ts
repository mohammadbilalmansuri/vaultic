import { create } from "zustand";

export type TStep = 1 | 2 | 3 | 4 | 5 | 6;
export type TPath = "create" | "import";
export type TNetwork = "solana" | "ethereum";

export interface IOnboardingState {
  step: TStep;
  path: TPath | null;
  network: TNetwork | null;
  seed: string;
  password: string;
  setStep: (step: TStep) => void;
  setPath: (path: TPath) => void;
  setNetwork: (network: TNetwork) => void;
  setSeed: (seed: string) => void;
  setPassword: (password: string) => void;
  reset: () => void;
}

export const useOnboardingStore = create<IOnboardingState>((set) => ({
  step: 1,
  path: null,
  network: null,
  seed: "",
  password: "",

  setStep: (step) => set({ step }),
  setPath: (path) => set({ path }),
  setNetwork: (network) => set({ network }),
  setSeed: (seed) => set({ seed }),
  setPassword: (password) => set({ password }),

  reset: () =>
    set({
      step: 1,
      path: null,
      network: null,
      seed: "",
      password: "",
    }),
}));
