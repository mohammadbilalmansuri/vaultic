"use client";
import { useTheme, useToggleTheme } from "@/stores";
import cn from "@/utils/cn";
import { Sun, Moon } from "../icons";

const ThemeSwitcher = ({ className = "" }) => {
  const theme = useTheme();
  const toggleTheme = useToggleTheme();

  const isDark = theme === "dark";
  const Icon = isDark ? Moon : Sun;
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn("icon-btn-bg", className)}
      aria-label={label}
    >
      <Icon />
    </button>
  );
};

export default ThemeSwitcher;
