"use client";
import { useEffect, ReactNode } from "react";
import useThemeStore from "@/stores/themeStore";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme = useThemeStore((state) => state.theme);
  const isHydrated = useThemeStore((state) => state.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;
    document.documentElement.className = theme;
  }, []);

  if (!isHydrated) return null;

  return <>{children}</>;
};

export default ThemeProvider;
