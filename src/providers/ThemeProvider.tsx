"use client";

import { useEffect, useState } from "react";
import useThemeStore from "@/store/theme";

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

  return (
    <div className="w-full min-h-dvh relative flex flex-col items-center justify-between">
      {children}
    </div>
  );
}
