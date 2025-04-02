"use client";
import { useEffect, ReactNode } from "react";
import { useThemeStore } from "@/stores/themeStore";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme = useThemeStore((state) => state.theme);
  const isHydrated = useThemeStore((state) => state.isHydrated);

  useEffect(() => {
    if (isHydrated) {
      document.documentElement.className = theme;
    }
  }, [isHydrated, theme]);

  if (!isHydrated) return null;

  return <div className="root">{children}</div>;
};

export default ThemeProvider;
