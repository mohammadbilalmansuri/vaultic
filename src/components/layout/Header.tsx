"use client";
import { useThemeStore } from "@/stores/themeStore";
import { Switch, NavLink } from "@/components/common";
import { Logo, Moon, Sun } from "@/components/icons";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import cn from "@/utils/cn";

const Header = () => {
  const { theme, toggleTheme } = useThemeStore();
  const pathname = usePathname();
  const authenticated = useUserStore((state) => state.authenticated);

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
          {authenticated && (
            <>
              <NavLink href="/dashboard" active={pathname === "/dashboard"}>
                Dashboard
              </NavLink>
              <NavLink href="/account" active={pathname === "/account"}>
                Account
              </NavLink>
            </>
          )}

          <div className="flex items-center gap-2">
            <Sun
              className={cn("size-5", {
                "stroke-zinc-800": theme === "light",
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
                "stroke-zinc-200": theme === "dark",
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
