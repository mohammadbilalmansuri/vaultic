"use client";
import { Sun, Moon } from "@/components/ui/icons";
import useThemeStore from "@/stores/themeStore";

const ThemeSwitcher = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button
      type="button"
      className="size-10 flex items-center justify-center rounded-xl transition-all duration-300 hover:bg-primary icon-stroke-hover active:scale-90"
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <Moon className="w-5.5" />
      ) : (
        <Sun className="w-5.5" />
      )}
    </button>
  );
};

export default ThemeSwitcher;
