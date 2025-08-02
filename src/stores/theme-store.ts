"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ThemeState {
  theme: "light" | "dark";
  isHydrated: boolean;
}

interface ThemeActions {
  toggleTheme: () => void;
}

interface ThemeStore extends ThemeState {
  actions: ThemeActions;
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

      actions: {
        toggleTheme: () =>
          set({ theme: get().theme === "dark" ? "light" : "dark" }),
      },
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

export const useTheme = () => useThemeStore((state) => state.theme);

export const useIsHydrated = () => useThemeStore((state) => state.isHydrated);

export const useThemeActions = () => useThemeStore((state) => state.actions);

export const getThemeState = () => useThemeStore.getState();
