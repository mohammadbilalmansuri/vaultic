"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAccountsStore, useNotificationStore } from "@/stores";
import { useOutsideClick } from "@/hooks";
import { Check, ChevronsUpDown } from "../ui/icons";
import cn from "@/utils/cn";

interface AccountSwitcherProps {
  variant?: "inline" | "dropdown";
  containerClassName?: string;
}

const AccountSwitcher = ({
  variant = "inline",
  containerClassName = "",
}: AccountSwitcherProps) => {
  const notify = useNotificationStore((state) => state.notify);
  const [opened, setOpened] = useState(false);
  const containerRef = useOutsideClick(() => {
    if (opened) setOpened(false);
  }, opened);

  const accounts = useAccountsStore((state) => state.accounts);
  const activeAccountIndex = useAccountsStore(
    (state) => state.activeAccountIndex
  );
  const setActiveAccountIndex = useAccountsStore(
    (state) => state.setActiveAccountIndex
  );

  const handleAccountSwitch = (index: number) => {
    if (index === activeAccountIndex) {
      setOpened(false);
      return;
    }
    setActiveAccountIndex(index);
    setOpened(false);
    notify({
      type: "success",
      message: `Switched to Account ${index + 1}`,
      duration: 3000,
    });
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full flex flex-col items-center border border-color rounded-2xl transition-all duration-300",
        { "hover:border-focus": !opened },
        { "border-focus": opened && variant === "dropdown" },
        containerClassName
      )}
    >
      <button
        type="button"
        className={cn(
          "w-full flex items-center justify-between gap-4 h-12 pl-4 pr-2 py-3 rounded-2xl",
          { "border-b border-color": opened && variant === "inline" }
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
              "w-[98%] absolute top-full mt-1.5 bg-default border border-color rounded-2xl z-10 shadow-xl":
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
                    {activeAccountIndex === index && (
                      <Check className="w-5 text-teal-500" />
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
