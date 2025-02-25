"use client";

import { useEffect, useState } from "react";
import useThemeStore from "@/store/themeStore";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, isHydrated } = useThemeStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!isHydrated) {
      setHydrated(true);
      return;
    }
    document.documentElement.className = theme;
  }, [isHydrated, theme]);

  if (!hydrated) return null;

  return <>{children}</>;
}
