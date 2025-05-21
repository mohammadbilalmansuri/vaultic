"use client";
import { ThemeSwitcher, NavLink } from "@/components/ui";
import { Logo, Github } from "@/components/ui/icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useWalletStore } from "@/stores";

const Header = () => {
  const pathname = usePathname();
  const walletExists = useWalletStore((state) => state.walletExists);

  return (
    <header className="w-full relative flex flex-col items-center px-5 min-h-fit">
      <div className="w-full max-w-screen-lg relative flex items-center justify-between gap-5 py-5">
        <Link
          href={walletExists ? "/dashboard" : "/"}
          className="flex items-center gap-2.5 select-none"
        >
          <Logo className="w-7 text-teal-500" />
          <span className="-mt-0.5 text-3xl lowercase leading-[0.8] font-bold text-teal-500">
            vaultic
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          {walletExists ? (
            <NavLink href="/dashboard" active={pathname === "/dashboard"}>
              Dashboard
            </NavLink>
          ) : (
            <NavLink href="/setup" active={pathname === "/setup"}>
              Set Up Your Wallet
            </NavLink>
          )}
          <NavLink href="/faucet" active={pathname === "/faucet"}>
            Faucet
          </NavLink>
          <NavLink
            href="/help-and-support"
            active={pathname === "/help-and-support"}
          >
            Help & Support
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="https://github.com/mohammadbilalmansuri/vaultic"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn-bg"
          >
            <Github />
          </Link>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
