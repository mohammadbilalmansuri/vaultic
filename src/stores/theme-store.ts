"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  isHydrated: boolean;

  /** Toggles between 'light' and 'dark' theme. */
  toggleTheme: () => void;

  /**
   * Sets the theme explicitly.
   * @param theme The theme to apply ('light' or 'dark').
   */
  setTheme: (theme: Theme) => void;
}

/* Zustand store for theme state with persistence */
const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "dark",
      isHydrated: false,

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;

        if (state) {
          state.setTheme(prefersDark ? "dark" : "light");
          state.isHydrated = true;
        }
      },
    }
  )
);

/** Returns the currently active theme ('light' or 'dark'). */
export const useTheme = () => useThemeStore((state) => state.theme);

/** Returns whether the theme has been rehydrated from persisted storage. */
export const useIsHydrated = () => useThemeStore((state) => state.isHydrated);

/** Provides a method to toggle between light and dark themes. */
export const useToggleTheme = () => useThemeStore((state) => state.toggleTheme);
