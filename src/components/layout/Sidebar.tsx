"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import cn from "@/utils/cn";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Send", href: "/send" },
  { name: "Receive", href: "/receive" },
  { name: "Accounts", href: "/accounts" },
  { name: "Activity", href: "/activity" },
  { name: "Settings", href: "/settings" },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
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
  );
};

export default Sidebar;
