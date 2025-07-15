"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ThemeStore {
  theme: "light" | "dark";
  isHydrated: boolean;
  toggleTheme: () => void;
}

/**
 * Theme store for managing light/dark mode with localStorage persistence.
 * Automatically hydrates from localStorage on initialization.
 */
const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "dark",
      isHydrated: false,

      toggleTheme: () =>
        set({
          theme: get().theme === "dark" ? "light" : "dark",
        }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.isHydrated = true;
      },
    }
  )
);

export default useThemeStore;
