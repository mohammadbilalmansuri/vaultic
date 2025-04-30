import cn from "@/utils/cn";
import { Sun, Moon } from "@/components/ui/icons";
import useThemeStore from "@/stores/themeStore";

const ThemeSwitcher = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button
      type="button"
      className="size-10 flex items-center justify-center rounded-xl stroke-zinc-600 dark:stroke-zinc-400 transition-all duration-300 active:scale-95 hover:bg-primary hover:stroke-zinc-800 dark:hover:stroke-zinc-200"
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
