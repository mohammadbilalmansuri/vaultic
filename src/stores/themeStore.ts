"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface IThemeState {
  theme: "light" | "dark";
  isHydrated: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<IThemeState>()(
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
