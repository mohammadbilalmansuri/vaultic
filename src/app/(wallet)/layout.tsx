"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useWalletStore } from "@/stores";
import { LayoutProps } from "@/types";
import cn from "@/utils/cn";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Send", href: "/send" },
  { name: "Receive", href: "/receive" },
  { name: "Accounts", href: "/accounts" },
  { name: "Activity", href: "/activity" },
  { name: "Settings", href: "/settings" },
];

const WalletLayout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const walletExists = useWalletStore((state) => state.walletExists);
  const walletStatus = useWalletStore((state) => state.walletStatus);

  useEffect(() => {
    if (walletStatus === "ready" && !walletExists) {
      router.replace("/");
    }
  }, []);

  if (walletStatus === "checking" || !walletExists) return null;

  return (
    <div className="w-full flex flex-1">
      <aside className="w-64 border-r p-4 bg-white dark:bg-zinc-900">
        <div className="font-semibold text-xl mb-6 px-2">Vaultic</div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("px-3 py-2 rounded hover:bg-muted transition", {
                "bg-muted font-medium": pathname === item.href,
              })}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
};

export default WalletLayout;
