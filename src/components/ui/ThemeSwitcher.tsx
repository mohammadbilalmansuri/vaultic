"use client";
import { useThemeStore } from "@/stores";
import { Sun, Moon } from "./icons";

const ThemeSwitcher = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button type="button" className="icon-btn-bg" onClick={toggleTheme}>
      {theme === "dark" ? <Moon /> : <Sun />}
    </button>
  );
};

export default ThemeSwitcher;
