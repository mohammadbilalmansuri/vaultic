"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAccountsStore } from "@/stores";
import { useWallet, useAccounts } from "@/hooks";
import { Button, ThemeSwitcher, SidebarNavLink, Select } from "../ui";
import {
  Logo,
  Wallet,
  Cards,
  Setting,
  WalletMoney,
  QuestionMark,
  Lock,
} from "../ui/icons";

const navLinks = [
  { name: "Dashboard", href: "/dashboard", icon: Wallet },
  { name: "Accounts", href: "/accounts", icon: Cards },
  { name: "Settings", href: "/settings", icon: Setting },
  { name: "Faucet", href: "/faucet", icon: WalletMoney },
  {
    name: "Help & Support",
    href: "/help-and-support",
    icon: QuestionMark,
    target: "_blank",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { lockWallet } = useWallet();
  const { switchActiveAccount } = useAccounts();

  const accounts = useAccountsStore((state) => state.accounts);
  const activeAccountIndex = useAccountsStore(
    (state) => state.activeAccountIndex
  );
  const switchingToAccount = useAccountsStore(
    (state) => state.switchingToAccount
  );

  const accountOptions = Object.keys(accounts)
    .map(Number)
    .sort((a, b) => a - b)
    .map((index) => ({ label: `Account ${index + 1}`, value: index }));

  return (
    <aside className="w-[18rem] border-r-1.5 border-color flex flex-col justify-between gap-5 p-5 overflow-y-auto scrollbar-thin">
      <div className="w-full flex flex-col gap-5">
        <div className="w-full flex items-center justify-between gap-4 -mt-0.5">
          <Link href="/dashboard" className="px-0.5">
            <Logo className="w-7 text-teal-500" />
          </Link>
          <div className="-mr-0.5">
            <ThemeSwitcher />
          </div>
        </div>

        <nav className="relative flex flex-col gap-3">
          {navLinks.map(({ name, href, icon: Icon, target }) => (
            <SidebarNavLink
              key={name}
              name={name}
              href={href}
              icon={Icon}
              isActive={pathname === href}
              target={target}
            />
          ))}
        </nav>
      </div>

      <div className="w-full flex flex-col gap-5">
        <Select
          options={accountOptions}
          value={activeAccountIndex}
          onChange={switchActiveAccount}
          selecting={switchingToAccount !== null}
          variant="inline"
        />

        <Button onClick={lockWallet}>
          <Lock className="w-5 -mt-px" />
          <span className="leading-none">Lock Vaultic</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
