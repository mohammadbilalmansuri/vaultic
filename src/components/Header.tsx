"use client";
import useThemeStore from "@/stores/themeStore";
import { Switch, NavLink } from "@/components/ui";
import { Logo, Moon, Sun } from "./ui/icons";
import cn from "@/utils/cn";
import { usePathname } from "next/navigation";

const Header = () => {
  const { theme, toggleTheme } = useThemeStore();
  const pathname = usePathname();

  return (
    <header className="w-full relative flex flex-col items-center px-5 min-h-fit">
      <div className="w-full max-w-screen-lg relative flex items-center justify-between py-5">
        <div className="flex items-center gap-2 cursor-default select-none">
          <Logo />
          <span className="mt-px text-3xl leading-[0.8] font-bold text-teal-500">
            Vaultic
          </span>
        </div>

        <nav className="flex items-center gap-8">
          <NavLink href="/wallets" active={pathname === "/wallets"}>
            Wallets
          </NavLink>
          <NavLink href="/send" active={pathname === "/send"}>
            Send
          </NavLink>
          <NavLink href="/account" active={pathname === "/account"}>
            Account
          </NavLink>

          <div className="flex items-center gap-2">
            <Sun
              className={cn("size-5", {
                "stroke-zinc-900": theme === "light",
                "stroke-zinc-400": theme === "dark",
              })}
            />
            <Switch
              state={theme === "dark"}
              colorDependsOnState={false}
              onClick={toggleTheme}
            />
            <Moon
              className={cn("size-5", {
                "stroke-zinc-100": theme === "dark",
                "stroke-zinc-400": theme === "light",
              })}
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
