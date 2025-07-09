"use client";
import { TTooltipPosition } from "@/types";
import { useThemeStore } from "@/stores";
import cn from "@/utils/cn";
import { Sun, Moon } from "../icons";
import Tooltip from "./Tooltip";

interface ThemeSwitcherProps {
  withTooltip?: boolean;
  tooltipPosition?: TTooltipPosition;
  className?: string;
}

const ThemeSwitcher = ({
  withTooltip = false,
  tooltipPosition,
  className = "",
}: ThemeSwitcherProps) => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const isDark = theme === "dark";
  const Icon = isDark ? Moon : Sun;
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  const button = (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn("icon-btn-bg", className)}
      aria-label={label}
      aria-pressed={isDark}
      role="switch"
      aria-checked={isDark}
    >
      <Icon />
    </button>
  );

  if (withTooltip) {
    return (
      <Tooltip content={label} position={tooltipPosition}>
        {button}
      </Tooltip>
    );
  }

  return button;
};

export default ThemeSwitcher;
