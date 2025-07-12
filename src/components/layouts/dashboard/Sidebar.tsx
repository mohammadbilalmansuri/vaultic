"use client";
import { useState, useEffect } from "react";
import { MouseEvent } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { NAVIGATION_SIDEBAR } from "@/constants";
import { useAccountsStore } from "@/stores";
import cn from "@/utils/cn";
import {
  useWallet,
  useAccounts,
  useMatchMedia,
  useOutsideClick,
} from "@/hooks";
import { Logo, Lock, SidebarClose, SidebarOpen } from "@/components/icons";
import { Button, ThemeSwitcher, Select, Tooltip } from "@/components/ui";
import TestnetNotice from "./TestnetNotice";

type TSidebarState = "hidden" | "collapsed" | "visible";

const sidebarVariants = {
  hidden: { width: 0, opacity: 0 },
  collapsed: { width: 64, opacity: 1 },
  visible: { width: 256, opacity: 1 },
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const Sidebar = () => {
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

  const pathname = usePathname();
  const { lockWallet } = useWallet();
  const { switchActiveAccount } = useAccounts();
  const isSmallScreen = useMatchMedia("(max-width: 1024px)");

  const [sidebarState, setSidebarState] = useState<TSidebarState>(
    isSmallScreen ? "hidden" : "visible"
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const isSidebarOpenOnSmallScreen =
    isSmallScreen && sidebarState === "visible";
  const isCollapsed = sidebarState === "collapsed";

  const toggleSidebar = (newState: TSidebarState) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSidebarState(newState);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const sidebarOutsideClickRef = useOutsideClick<HTMLDivElement>(() => {
    if (isSidebarOpenOnSmallScreen) toggleSidebar("hidden");
  }, isSidebarOpenOnSmallScreen);

  useEffect(() => {
    if (isSidebarOpenOnSmallScreen) toggleSidebar("hidden");
  }, [pathname]);

  useEffect(() => {
    toggleSidebar(isSmallScreen ? "hidden" : "visible");
  }, [isSmallScreen]);

  return (
    <div className="flex lg:flex-row flex-col">
      {/* Mobile Header */}
      <header className="w-full relative z-30 lg:hidden flex items-center justify-between gap-4 md:px-5 px-4 md:py-4 py-3">
        <Tooltip content="Open Sidebar" position="right">
          <button
            aria-label="Open Sidebar"
            className="icon-btn-bg"
            onClick={(e) => {
              e.stopPropagation();
              toggleSidebar("visible");
            }}
          >
            <SidebarOpen />
          </button>
        </Tooltip>

        <TestnetNotice />
        <ThemeSwitcher />
      </header>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isSidebarOpenOnSmallScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        aria-label="Dashboard Sidebar"
        initial={false}
        animate={sidebarState}
        variants={sidebarVariants}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={cn("h-full", {
          "overflow-hidden": isAnimating || sidebarState === "hidden",
          "fixed top-0 left-0 z-50": isSmallScreen,
        })}
      >
        <div
          ref={isSidebarOpenOnSmallScreen ? sidebarOutsideClickRef : null}
          className={cn(
            "transition-all duration-200 size-full min-w-fit bg-default flex flex-col justify-between gap-4 border-r-1.5 px-3 pt-3 pb-4",
            { "cursor-pointer": isCollapsed }
          )}
          onClick={
            isCollapsed
              ? (e) => {
                  const target = e.target;
                  if (
                    target instanceof Element &&
                    !target.closest("[data-clickable]")
                  ) {
                    toggleSidebar("visible");
                  }
                }
              : undefined
          }
        >
          <div className="w-full relative flex flex-col items-start gap-4">
            <div className="w-full relative flex items-center justify-between">
              <div className="flex items-center justify-center sm:size-10 size-9 relative">
                {isCollapsed ? (
                  <Tooltip content="Open Sidebar" position="right">
                    <div className="icon-btn-bg group" tabIndex={0}>
                      <Logo className="w-6 text-teal-500 group-hover:hidden group-focus:hidden" />
                      <SidebarOpen className="w-6 hidden group-hover:block group-focus:block" />
                    </div>
                  </Tooltip>
                ) : (
                  <Link href="/dashboard">
                    <Logo className="w-6 text-teal-500" />
                  </Link>
                )}
              </div>

              {!isCollapsed && (
                <div className="flex items-center gap-2">
                  <ThemeSwitcher />
                  <Tooltip content="Close Sidebar" position="right">
                    <button
                      type="button"
                      aria-label="Close sidebar"
                      className="icon-btn-bg"
                      onClick={() =>
                        toggleSidebar(isSmallScreen ? "hidden" : "collapsed")
                      }
                    >
                      <SidebarClose />
                    </button>
                  </Tooltip>
                </div>
              )}
            </div>

            <nav
              aria-label="Sidebar Navigation"
              className="w-full relative flex flex-col gap-4"
            >
              {NAVIGATION_SIDEBAR.map(({ name, href, Icon }, index) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={`link-${index}`}
                    href={href}
                    className={cn(
                      "transition-all p-2 min-w-10 h-10 rounded-xl flex items-center gap-2 relative overflow-hidden",
                      isActive
                        ? "bg-secondary heading-color cursor-default pointer-events-none"
                        : "hover:bg-secondary hover:heading-color"
                    )}
                    onClick={
                      isSidebarOpenOnSmallScreen
                        ? () => toggleSidebar("hidden")
                        : undefined
                    }
                    aria-current={isActive ? "page" : undefined}
                    data-clickable
                  >
                    <Icon className="w-5.5" />
                    <AnimatePresence initial={false}>
                      {!isCollapsed && (
                        <motion.span
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={contentVariants}
                          transition={{ duration: 0.1 }}
                          className="font-medium text-nowrap leading-snug"
                        >
                          {name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="w-full flex flex-col items-start gap-4">
            {isCollapsed ? (
              <Tooltip content="Lock Wallet" position="right">
                <button
                  type="button"
                  aria-label="Lock Wallet"
                  className="icon-btn-bg"
                  onClick={lockWallet}
                  data-clickable
                >
                  <Lock className="w-5.5" />
                </button>
              </Tooltip>
            ) : (
              <>
                <Select
                  options={accountOptions}
                  value={activeAccountIndex}
                  onChange={switchActiveAccount}
                  selecting={switchingToAccount !== null}
                  variant="inline"
                  aria-label="Select active account"
                  widthClassName="shrink-0 w-full"
                />

                <Button
                  onClick={lockWallet}
                  aria-label="Lock Wallet"
                  className="w-full"
                >
                  <Lock className="w-5 -mt-px" aria-hidden="true" />
                  <span className="leading-none">Lock Wallet</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.aside>
    </div>
  );
};

export default Sidebar;
