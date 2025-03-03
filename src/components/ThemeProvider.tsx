"use client";
import { useEffect, useState } from "react";
import useThemeStore from "@/store/theme";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme, isHydrated } = useThemeStore();
  const [hydrated, setHydrated] = useState(false);

  // here or in another route provide we have get the saved data of user if exist and load it to the store
  // based on user status we have to prevent routes
  // status ? user can go in dashboard but not in the home page : user can go in home page but not in the dashboard

  useEffect(() => {
    if (!isHydrated) {
      setHydrated(true);
      return;
    }
    document.documentElement.className = theme;
  }, [isHydrated, theme]);

  if (!hydrated) return null;

  return <div className="root">{children}</div>;
};

export default ThemeProvider;
