"use client";
import { useThemeStore } from "@/stores";
import { Sun, Moon } from "../icons";

const ThemeSwitcher = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const isDark = theme === "dark";
  const Icon = isDark ? Moon : Sun;
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      className="icon-btn-bg"
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={isDark}
    >
      <Icon />
    </button>
  );
};

export default ThemeSwitcher;
