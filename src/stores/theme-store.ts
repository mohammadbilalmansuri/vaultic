"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  isHydrated: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

/**
 * Zustand store instance for theme management with persistence.
 */
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

export const useTheme = () => useThemeStore((state) => state.theme);

export const useIsHydrated = () => useThemeStore((state) => state.isHydrated);

export const useToggleTheme = () => useThemeStore((state) => state.toggleTheme);
