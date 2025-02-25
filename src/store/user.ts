"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { setItem, getItem, deleteItem } from "@/utils/indexedDB";

interface UserState {
  password: string;
  mnemonic: string[];
  isHydrated: boolean;
  login: (password: string, mnemonic: string[]) => Promise<void>;
  logout: () => Promise<void>;
  loadMnemonic: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      password: "",
      mnemonic: [],
      isHydrated: false,

      // Login and save user details securely
      login: async (password, mnemonic) => {
        if (mnemonic.length !== 12)
          throw new Error("Mnemonic must be 12 words");

        await setItem("mnemonic", mnemonic); // Store securely in IndexedDB
        set({ password, mnemonic, isHydrated: true });
      },

      // Logout and remove sensitive data
      logout: async () => {
        await deleteItem("mnemonic");
        set({ password: "", mnemonic: [], isHydrated: false });
      },

      // Load mnemonic from IndexedDB on app start
      loadMnemonic: async () => {
        const storedMnemonic = await getItem<string[]>("mnemonic");
        if (storedMnemonic) {
          set({ mnemonic: storedMnemonic, isHydrated: true });
        }
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
