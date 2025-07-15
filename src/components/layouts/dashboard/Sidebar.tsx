"use client";
import { useState, useEffect, MouseEvent } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, Variant } from "motion/react";
import { NAVIGATION_SIDEBAR } from "@/constants";
import { useAccountsStore } from "@/stores";
import cn from "@/utils/cn";
import {
  useWallet,
  useAccounts,
  useMatchMedia,
  useOutsideClick,
} from "@/hooks";
import {
  Logo,
  Lock,
  SidebarClose,
  SidebarOpen,
  Cancel,
  AlignLeft,
} from "@/components/icons";
import { Button, ThemeSwitcher, Select, Tooltip } from "@/components/ui";
import TestnetNotice from "./TestnetNotice";

type TSidebarState = "close" | "collapse" | "open";

const SIDEBAR_VARIANTS: Record<TSidebarState, Variant> = {
  close: { width: 0, opacity: 0 },
  collapse: { width: 64, opacity: 1 },
  open: { width: 256, opacity: 1 },
} as const;

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
  const isLargeScreen = useMatchMedia("(min-width: 1024px)");

  const sidebarDefaultState: TSidebarState = isLargeScreen ? "open" : "close";

  const [sidebarState, setSidebarState] =
    useState<TSidebarState>(sidebarDefaultState);
  const [isAnimating, setIsAnimating] = useState(false);

  const isOpenedOnSmallScreen = sidebarState === "open" && !isLargeScreen;
  const isCollapsed = sidebarState === "collapse";
  const isHidden = sidebarState === "close";

  const toggleSidebar = (targetState: TSidebarState) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSidebarState(targetState);
  };

  const handleCollapsedSidebarClick = (e: MouseEvent) => {
    if (isAnimating || !isCollapsed) return;
    if (e.target instanceof Element && !e.target.closest("[data-clickable]")) {
      toggleSidebar("open");
    }
  };

  const closeSidebar = () => {
    if (isOpenedOnSmallScreen) toggleSidebar("close");
  };

  const sidebarOutsideClickRef = useOutsideClick<HTMLDivElement>(
    closeSidebar,
    isOpenedOnSmallScreen
  );

  useEffect(closeSidebar, [pathname]);

  useEffect(() => {
    if (sidebarState === sidebarDefaultState) return;
    toggleSidebar(sidebarDefaultState);
  }, [isLargeScreen]);

  return (
    <div className="flex lg:flex-row flex-col">
      {/* Mobile Header */}
      {!isLargeScreen && (
        <header className="w-full relative z-30 lg:hidden flex items-center justify-between gap-4 md:px-5 px-4 md:py-4 py-3">
          <Tooltip content="Open Sidebar" position="right">
            <button
              type="button"
              className="icon-btn-bg"
              onClick={() => toggleSidebar("open")}
              disabled={isAnimating}
              aria-label="Open Sidebar"
              aria-expanded={!isHidden}
            >
              <AlignLeft className="w-7" />
            </button>
          </Tooltip>

          <TestnetNotice />
          <ThemeSwitcher />
        </header>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpenedOnSmallScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed inset-0 bg-zinc-950/50 z-40 lg:hidden will-change-auto"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={sidebarState}
        animate={sidebarState}
        variants={SIDEBAR_VARIANTS}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onAnimationComplete={() => setIsAnimating(false)}
        className={cn("h-full will-change-auto", {
          "overflow-hidden": isAnimating || isHidden,
          "fixed top-0 left-0 z-50": !isLargeScreen,
        })}
        aria-label="Dashboard Sidebar"
        aria-expanded={!isHidden}
      >
        <div
          ref={isOpenedOnSmallScreen ? sidebarOutsideClickRef : null}
          className={cn(
            "size-full bg-default flex flex-col justify-between gap-4 border-r-1.5 px-3 pt-3 pb-4",
            { "cursor-e-resize group/collapsed": isCollapsed && !isAnimating }
          )}
          onClick={isCollapsed ? handleCollapsedSidebarClick : undefined}
        >
          <div className="w-full min-w-fit relative flex flex-col items-start gap-4">
            <div className="w-full relative flex items-center justify-between">
              <div className="flex items-center justify-center sm:size-10 size-9 relative">
                {isCollapsed ? (
                  <Tooltip content="Open Sidebar" position="right">
                    <div
                      className="icon-btn-bg group focus:bg-secondary focus:heading-color [.group\/collapsed:hover:not(:has([data-clickable]:hover))_&]:bg-secondary [.group\/collapsed:hover:not(:has([data-clickable]:hover))_&]:heading-color"
                      tabIndex={0}
                    >
                      <Logo className="w-6 text-teal-500 group-hover:hidden group-focus:hidden [.group\/collapsed:hover:not(:has([data-clickable]:hover))_&]:hidden" />
                      <SidebarOpen className="absolute hidden group-hover:block group-focus:block [.group\/collapsed:hover:not(:has([data-clickable]:hover))_&]:block" />
                    </div>
                  </Tooltip>
                ) : (
                  <Link href="/dashboard" data-clickable>
                    <Logo className="w-6 text-teal-500" />
                  </Link>
                )}
              </div>

              {!isCollapsed && (
                <div className="flex items-center gap-2">
                  {isLargeScreen && <ThemeSwitcher />}
                  <Tooltip
                    content={
                      isLargeScreen ? "Collapse Sidebar" : "Close Sidebar"
                    }
                    position={isLargeScreen ? "right" : "left"}
                  >
                    <button
                      type="button"
                      className={cn("icon-btn-bg", {
                        "cursor-e-resize": isLargeScreen && !isAnimating,
                      })}
                      onClick={() =>
                        toggleSidebar(isLargeScreen ? "collapse" : "close")
                      }
                      disabled={isAnimating}
                      aria-label={
                        isLargeScreen ? "Collapse Sidebar" : "Close Sidebar"
                      }
                      aria-expanded={!isCollapsed}
                    >
                      {isLargeScreen ? <SidebarClose /> : <Cancel />}
                    </button>
                  </Tooltip>
                </div>
              )}
            </div>

            <nav
              className="w-full relative flex flex-col gap-4 cursor-default"
              aria-label="Sidebar Navigation"
              data-clickable
            >
              {NAVIGATION_SIDEBAR.map(({ name, href, Icon }, index) => {
                const isActive = pathname === href;
                return (
                  <Tooltip
                    key={`sidebar-link-${index}`}
                    content={isCollapsed && !isAnimating ? name : undefined}
                    position="right"
                  >
                    <Link
                      href={href}
                      className={cn(
                        "p-2.25 rounded-xl flex items-center gap-2 relative transition-all duration-200",
                        isActive
                          ? "bg-secondary heading-color pointer-events-none"
                          : "hover:bg-secondary hover:heading-color"
                      )}
                      onClick={isOpenedOnSmallScreen ? closeSidebar : undefined}
                      aria-current={isActive ? "page" : undefined}
                      data-clickable
                    >
                      <Icon className="w-5.5" />
                      {!isCollapsed && (
                        <span className="font-medium text-nowrap leading-snug">
                          {name}
                        </span>
                      )}
                    </Link>
                  </Tooltip>
                );
              })}
            </nav>
          </div>

          <div className="w-full min-w-fit flex flex-col items-start gap-4">
            {isCollapsed ? (
              <Tooltip content="Lock Wallet" position="right">
                <button
                  type="button"
                  className="icon-btn-bg -mb-0.5"
                  onClick={lockWallet}
                  aria-label="Lock Wallet"
                  data-clickable
                >
                  <Lock />
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
                />

                <Button
                  onClick={lockWallet}
                  className="w-full"
                  aria-label="Lock Wallet"
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
