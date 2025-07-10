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

type TSidebarStatus = "hidden" | "collapsed" | "visible";

const sidebarVariants = () => {
  const transition = { duration: 0.3, ease: "easeInOut" };
  return {
    visible: { width: "16rem", transition },
    collapsed: { width: "4rem", transition },
    hidden: { width: "0rem", transition },
  };
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

  const [sidebarStatus, setSidebarStatus] = useState<TSidebarStatus>(
    isSmallScreen ? "hidden" : "visible"
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const isSidebarOpenOnSmallScreen =
    sidebarStatus === "visible" && isSmallScreen;

  const toggleSidebar = (
    e?: MouseEvent<HTMLButtonElement>,
    status?: TSidebarStatus
  ) => {
    if (isAnimating) return;

    setIsAnimating(true);
    e?.currentTarget.blur();

    if (status) {
      setSidebarStatus(status);
    } else {
      setSidebarStatus((prevStatus) => {
        if (prevStatus === "visible") {
          return isSmallScreen ? "hidden" : "collapsed";
        }
        return "visible";
      });
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  const hideSlidebar = () => {
    if (isSidebarOpenOnSmallScreen) {
      toggleSidebar(undefined, "hidden");
    }
  };

  const sidebarOutsideClickRef = useOutsideClick<HTMLDivElement>(
    hideSlidebar,
    isSidebarOpenOnSmallScreen
  );

  useEffect(() => {
    toggleSidebar(undefined, isSmallScreen ? "hidden" : "visible");
  }, [isSmallScreen]);

  return (
    <div className="flex lg:flex-row flex-col">
      <header className="w-full relative z-30 lg:hidden flex items-center justify-between gap-4 md:px-5 px-4 md:py-4 py-3">
        <Tooltip content="Open Sidebar" position="right">
          <button
            aria-label="Open Sidebar"
            className="icon-btn-bg"
            onClick={toggleSidebar}
          >
            <SidebarOpen />
          </button>
        </Tooltip>

        <TestnetNotice />
        <ThemeSwitcher />
      </header>

      <AnimatePresence>
        {isSidebarOpenOnSmallScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-primary z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        aria-label="Sidebar Navigation"
        variants={sidebarVariants()}
        animate={sidebarStatus}
        initial={sidebarStatus}
        className={cn("h-full will-change-auto", {
          "overflow-hidden": isAnimating,
          "fixed top-0 left-0 z-50": isSmallScreen,
          "pointer-events-none invisible": sidebarStatus === "hidden",
        })}
      >
        <div
          ref={isSidebarOpenOnSmallScreen ? sidebarOutsideClickRef : null}
          className="size-full min-w-fit bg-default flex flex-col justify-between gap-4 border-r-1.5 border-color md:px-3 px-2 md:pt-3 pt-2 md:pb-3.5 pb-2.5"
        >
          <div className="w-full relative flex flex-col items-start gap-4">
            <div className="w-full flex items-center justify-between">
              {sidebarStatus === "collapsed" ? (
                <Tooltip content="Open Sidebar" position="right">
                  <button
                    type="button"
                    aria-label="Open Sidebar"
                    onClick={toggleSidebar}
                    className="icon-btn-bg"
                  >
                    <Logo className="w-6 text-teal-500" />
                  </button>
                </Tooltip>
              ) : (
                <span className="flex items-center justify-center sm:size-10 size-9">
                  <Logo className="w-6 text-teal-500" />
                </span>
              )}

              <AnimatePresence>
                {sidebarStatus !== "collapsed" && (
                  <motion.div className="flex items-center gap-2">
                    {!isSmallScreen && <ThemeSwitcher />}
                    <Tooltip content="Close Sidebar" position="left">
                      <button
                        type="button"
                        aria-label="Close sidebar"
                        className="icon-btn-bg"
                        onClick={toggleSidebar}
                      >
                        <SidebarClose />
                      </button>
                    </Tooltip>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <nav
              className="w-full relative flex flex-col gap-4"
              aria-label="Sidebar Navigation"
            >
              {NAVIGATION_SIDEBAR.map(({ name, href, Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={name}
                    href={href}
                    className={cn(
                      "transition-all duration-200 p-2 h-10.5 rounded-xl flex items-center gap-2 relative overflow-hidden",
                      isActive
                        ? "bg-secondary heading-color cursor-default pointer-events-none"
                        : "hover:bg-primary hover:heading-color"
                    )}
                    aria-current={isActive ? "page" : undefined}
                    onClick={
                      isSidebarOpenOnSmallScreen ? hideSlidebar : undefined
                    }
                  >
                    <Icon className="w-5.5" />
                    <AnimatePresence>
                      {sidebarStatus !== "collapsed" && (
                        <motion.span className="font-medium mt-px text-nowrap">
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
            {sidebarStatus === "collapsed" ? (
              <>
                <div className="size-10 rounded-xl font-semibold uppercase flex items-center justify-center shrink-0 border-1.5 border-color bg-primary heading-color">
                  {`A${activeAccountIndex + 1}`}
                </div>

                <Tooltip content="Lock Vaultic" position="right">
                  <button
                    type="button"
                    aria-label="Lock Vaultic"
                    className="icon-btn-bg"
                    onClick={lockWallet}
                  >
                    <motion.div>
                      <Lock />
                    </motion.div>
                  </button>
                </Tooltip>
              </>
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
                  aria-label="Lock Vaultic wallet"
                  className="w-full"
                >
                  <Lock className="w-5 -mt-px" aria-hidden="true" />
                  <span className="leading-none">Lock Vaultic</span>
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
