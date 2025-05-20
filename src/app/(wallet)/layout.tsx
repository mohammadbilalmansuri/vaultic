"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks";
import cn from "@/utils/cn";
import { ReactNode } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Send", href: "/send" },
  { name: "Receive", href: "/receive" },
  { name: "Accounts", href: "/accounts" },
  { name: "Activity", href: "/activity" },
  { name: "Settings", href: "/settings" },
];

export default function WalletLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { walletExists } = useWallet();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const exists = await walletExists();
      if (!exists) {
        router.replace("/");
        return;
      }
      setLoading(false);
    };

    checkAccess();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white dark:bg-zinc-900 p-4">
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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
