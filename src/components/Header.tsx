"use client";
import useThemeStore from "@/stores/themeStore";
import { Switch, NavLink } from "@/components/ui";
import { Logo, Moon, Sun } from "@/components/ui/icons";
import { usePathname } from "next/navigation";
import useUserStore from "@/stores/userStore";
import cn from "@/utils/cn";

const Header = () => {
  const pathname = usePathname();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
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
