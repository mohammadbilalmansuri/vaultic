"use client";
import { useEffect } from "react";
import { Children } from "@/types";
import { useThemeStore } from "@/stores";

const ThemeProvider = ({ children }: Children) => {
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
