"use client";
import { useEffect } from "react";
import type { Children } from "@/types";
import { useTheme, useIsHydrated } from "@/stores";

const ThemeProvider = ({ children }: Children) => {
  const theme = useTheme();
  const isHydrated = useIsHydrated();

  useEffect(() => {
    if (!isHydrated) return;
    document.documentElement.className = theme;
  }, [isHydrated, theme]);

  if (!isHydrated) return null;

  return <div className="root">{children}</div>;
};

export default ThemeProvider;
