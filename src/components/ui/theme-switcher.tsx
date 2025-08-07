"use client";
import { useTheme } from "next-themes";
import cn from "@/utils/cn";
import { Sun, Moon } from "../icons";

const ThemeSwitcher = ({ className = "" }) => {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";
  const Icon = isDark ? Moon : Sun;
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

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
