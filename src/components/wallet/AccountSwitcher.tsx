"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAccountsStore, useNotificationStore } from "@/stores";
import cn from "@/utils/cn";
import { useOutsideClick, useAccounts } from "@/hooks";
import { Loader } from "../ui";
import { Check, ChevronsUpDown } from "../ui/icons";

interface AccountSwitcherProps {
  variant?: "inline" | "dropdown";
  containerClassName?: string;
}

const AccountSwitcher = ({
  variant = "inline",
  containerClassName = "",
}: AccountSwitcherProps) => {
  const [opened, setOpened] = useState(false);
  const containerRef = useOutsideClick(() => {
    if (opened) setOpened(false);
  }, opened);

  const { switchActiveAccount } = useAccounts();
  const notify = useNotificationStore((state) => state.notify);
  const accounts = useAccountsStore((state) => state.accounts);
  const activeAccountIndex = useAccountsStore(
    (state) => state.activeAccountIndex
  );
  const switchingActiveAccount = useAccountsStore(
    (state) => state.switchingActiveAccount
  );
  const setSwitchingActiveAccount = useAccountsStore(
    (state) => state.setSwitchingActiveAccount
  );

  const handleAccountSwitch = async (index: number) => {
    if (switchingActiveAccount) return;

    if (index === activeAccountIndex) {
      setOpened(false);
      return;
    }

    setSwitchingActiveAccount(index);

    try {
      await switchActiveAccount(index);
      setOpened(false);
      notify({
        type: "success",
        message: `Switched to Account ${index + 1}`,
        duration: 3000,
      });
    } catch {
      notify({
        type: "error",
        message: `Failed to switch to Account ${index + 1}`,
      });
    } finally {
      setSwitchingActiveAccount(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full min-w-50 flex flex-col items-center border-1.5 border-color rounded-2xl transition-all duration-300",
        { "hover:border-focus": !opened },
        { "border-focus": opened && variant === "dropdown" },
        containerClassName
      )}
    >
      <button
        type="button"
        className={cn(
          "w-full flex items-center justify-between gap-4 h-12 pl-4 pr-2 py-3 rounded-2xl",
          { "border-b-1.5 border-color": opened && variant === "inline" }
        )}
        onClick={() => setOpened((prev) => !prev)}
      >
        <span className="heading-color font-medium">{`Account ${
          activeAccountIndex + 1
        }`}</span>
        <span className={cn("icon-btn-bg-sm", { "heading-color": opened })}>
          <ChevronsUpDown />
        </span>
      </button>

      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn("overflow-hidden", {
              "w-full": variant === "inline",
              "w-[98%] absolute top-full mt-1.5 bg-default border-1.5 border-color rounded-2xl z-10 shadow-xl":
                variant === "dropdown",
            })}
          >
            <div
              className={cn(
                "w-full flex flex-col gap-2 p-2 max-h-62 overflow-y-auto scrollbar-thin",
                { "bg-input": variant === "dropdown" }
              )}
            >
              {Object.keys(accounts)
                .map((key) => Number(key))
                .sort((a, b) => a - b)
                .map((index) => (
                  <button
                    key={index}
                    type="button"
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl transition-all duration-300",
                      {
                        "bg-primary heading-color":
                          activeAccountIndex === index,
                        "hover:bg-primary hover:heading-color":
                          activeAccountIndex !== index,
                      }
                    )}
                    onClick={() => handleAccountSwitch(index)}
                  >
                    <span>{`Account ${index + 1}`}</span>
                    {switchingActiveAccount === index ? (
                      <Loader size="xs" />
                    ) : (
                      activeAccountIndex === index &&
                      !switchingActiveAccount && (
                        <Check className="w-5 text-teal-500" />
                      )
                    )}
                  </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccountSwitcher;
