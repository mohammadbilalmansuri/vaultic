"use client";
import { useState } from "react";
import { MouseEvent, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { NAVIGATION_SIDEBAR } from "@/constants";
import { useAccountsStore } from "@/stores";
import cn from "@/utils/cn";
import {
  useWallet,
  useAccounts,
  useMatchMedia,
  useOutsideClick,
} from "@/hooks";
import { Button, ThemeSwitcher, Select, Tooltip } from "@/components/ui";
import { Logo, Lock, Cancel, AlignLeft } from "@/components/icons";

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

  const isSmallScreen = useMatchMedia("(max-width: 1024px)");
  const [isSidebarOpen, setIdSidebarOpen] = useState(!isSmallScreen);
  let sidebarOutsideClickRef = useOutsideClick<HTMLDivElement>(
    () => isSidebarOpen && setIdSidebarOpen(false),
    isSidebarOpen
  );

  useEffect(() => {
    setIdSidebarOpen(!isSmallScreen);
  }, [isSmallScreen]);

  const toggleSidebar = (e: MouseEvent<HTMLButtonElement>) => {
    setIdSidebarOpen((prev) => !prev);
    e.currentTarget.blur();
  };

  return (
    <div className="flex">
      <div className="w-full relative lg:hidden flex items-center justify-between sm:p-4 p-3">
        <Tooltip content="Open Sidebar" position="right">
          <button
            className="icon-btn-bg"
            aria-label="Open Sidebar"
            onClick={toggleSidebar}
          >
            <AlignLeft className="w-7" />
          </button>
        </Tooltip>
      </div>

      <AnimatePresence initial={false}>
        <motion.aside
          aria-label="Dashboard main navigation"
          className="overflow-hidden flex lg:relative fixed z-[9999] left-0 h-full bg-primary"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: isSidebarOpen ? "100%" : 0 }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
        >
          <div
            ref={isSmallScreen ? sidebarOutsideClickRef : null}
            className="bg-default xl:w-72 lg:w-64 w-72 min-w-fit shrink-0 flex flex-col justify-between gap-5 p-5 border-r-1.5 border-color overflow-x-hidden overflow-y-auto scrollbar-thin"
          >
            <div className="w-full relative flex flex-col gap-5">
              <div className="w-full flex items-center justify-between gap-4 -mt-0.5">
                <Link href="/dashboard" className="px-0.5">
                  <Logo className="sm:w-7 w-6 text-teal-500" />
                </Link>

                <div className="flex items-center xs:gap-3 gap-2 -mr-0.5">
                  <ThemeSwitcher />
                  <Tooltip content="Close Sidebar" position="left">
                    <button
                      type="button"
                      aria-label="Close sidebar"
                      className="icon-btn-bg lg:hidden"
                      onClick={toggleSidebar}
                    >
                      <Cancel />
                    </button>
                  </Tooltip>
                </div>
              </div>

              <nav
                className="w-full relative flex flex-col gap-3"
                aria-label="Sidebar Navigation"
              >
                {NAVIGATION_SIDEBAR.map(({ name, href, Icon }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={name}
                      href={href}
                      className={cn(
                        "transition-all duration-300 px-4 py-3 h-12 rounded-xl flex items-center gap-3 group",
                        {
                          "bg-primary heading-color cursor-default pointer-events-none":
                            isActive,
                          "hover:bg-primary hover:heading-color": !isActive,
                        }
                      )}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => {
                        if (!isSmallScreen) return;
                        setIdSidebarOpen(false);
                      }}
                    >
                      <Icon
                        className={cn(
                          "w-5.5 transition-all duration-300",
                          isActive
                            ? "text-teal-500 scale-110"
                            : "group-hover:scale-110"
                        )}
                        aria-hidden="true"
                      />
                      <span className="font-medium mt-px">{name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="w-full relative flex flex-col gap-5">
              <Select
                options={accountOptions}
                value={activeAccountIndex}
                onChange={switchActiveAccount}
                selecting={switchingToAccount !== null}
                variant="inline"
                aria-label="Select active account"
              />

              <Button onClick={lockWallet} aria-label="Lock Vaultic wallet">
                <Lock className="w-5 -mt-px" aria-hidden="true" />
                <span className="leading-none">Lock Vaultic</span>
              </Button>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
