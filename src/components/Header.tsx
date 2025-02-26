"use client";
import useThemeStore from "@/store/theme";
import Switch from "./ui/switch";
import cn from "@/utils/cn";

const Header = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="w-full relative flex flex-col items-center px-4 min-h-fit">
      <div className="w-full max-w-screen-lg relative flex items-center justify-between py-4">
        <div className="flex items-center gap-2 cursor-default select-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="h-8 w-auto fill-teal-500"
          >
            <path d="M156.8 126.8c37.6 60.6 64.2 113.1 84.3 162.5-8.3 33.8-18.8 66.5-31.3 98.3-13.2-52.3-26.5-101.3-56-148.5 6.5-36.4 2.3-73.6 3-112.3zM109.3 200H16.1c-6.5 0-10.5 7.5-6.5 12.7C51.8 267 81.3 330.5 101.3 400h103.5c-16.2-69.7-38.7-133.7-82.5-193.5-3-4-8-6.5-13-6.5zm47.8-88c68.5 108 130 234.5 138.2 368H409c-12-138-68.4-265-143.2-368H157.1zm251.8-68.5c-1.8-6.8-8.2-11.5-15.2-11.5h-88.3c-5.3 0-9 5-7.8 10.3 13.2 46.5 22.3 95.5 26.5 146 48.2 86.2 79.7 178.3 90.6 270.8 15.8-60.5 25.3-133.5 25.3-203 0-73.6-12.1-145.1-31.1-212.6z" />
          </svg>
          <span className="mt-px text-3xl leading-[0.8] font-bold text-teal-500">
            Vaultic
          </span>
        </div>

        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("size-5", {
              "stroke-zinc-900": theme === "light",
              "stroke-zinc-400": theme === "dark",
            })}
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>

          <Switch
            state={theme === "dark"}
            colorDependsOnState={false}
            onClick={toggleTheme}
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("size-5", {
              "stroke-zinc-100": theme === "dark",
              "stroke-zinc-400": theme === "light",
            })}
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;
