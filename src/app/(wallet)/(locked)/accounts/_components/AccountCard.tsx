"use client";
import { use, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DEFAULT_NETWORK } from "@/constants";
import type { Account, Network } from "@/types";
import { useAccountsStore, useNotificationStore } from "@/stores";
import { expandCollapseAnimation, fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import delay from "@/utils/delay";
import { useAccounts, useOutsideClick } from "@/hooks";
import { Trash, Check, Cancel } from "@/components/icons";
import { Loader, Tooltip } from "@/components/ui";
import NetworkDetails from "./NetworkDetails";

interface AccountCardProps {
  accountIndex: number;
  account: Account;
  isActive: boolean;
  hasMultipleAccounts: boolean;
}

const AccountCard = ({
  accountIndex,
  account,
  isActive,
  hasMultipleAccounts,
}: AccountCardProps) => {
  const switchingToAccount = useAccountsStore(
    (state) => state.switchingToAccount
  );
  const notify = useNotificationStore((state) => state.notify);

  const [showingNetwork, setShowingNetwork] =
    useState<Network>(DEFAULT_NETWORK);
  const [removeState, setRemoveState] = useState<"want" | "removeState" | "no">(
    "no"
  );

  const isRemoveConfirmationOpen = removeState === "want";

  const { switchActiveAccount, deleteAccount } = useAccounts();
  const removeDropdownOutsideClickRef = useOutsideClick<HTMLDivElement>(() => {
    if (isRemoveConfirmationOpen) setRemoveState("no");
  }, isRemoveConfirmationOpen);

  const isSwitching = switchingToAccount === accountIndex;

  const handleAccountRemove = async () => {
    if (removeState !== "want") return;
    setRemoveState("removeState");

    try {
      await delay(1000);
      await deleteAccount(accountIndex);
      notify({
        type: "success",
        message: `Account ${accountIndex + 1} removed successfully.`,
      });
    } catch {
      notify({
        type: "error",
        message: "Failed to remove account. Please try again.",
      });
    } finally {
      setRemoveState("no");
    }
  };

  return (
    <motion.div
      className="w-full relative rounded-3xl border-1.5 md:p-4 p-3 flex flex-col items-center md:gap-4 gap-3"
      {...fadeUpAnimation({ delay: accountIndex * 0.05 })}
    >
      <div className="flex items-center gap-2 bg-default rounded-lg absolute z-10 -top-4.25">
        <span className="text-primary border-1.5 text-sm font-medium uppercase leading-none px-2.5 py-2 rounded-lg whitespace-nowrap">
          Account {accountIndex + 1}
        </span>
        {isActive && (
          <span className="text-primary border-1.5 text-sm font-medium uppercase leading-none px-2.5 py-2 rounded-lg whitespace-nowrap">
            Active
          </span>
        )}
      </div>

      <div className="w-full relative flex items-center justify-between gap-4 md:mt-0 mt-5">
        <div className="flex items-center gap-2">
          {Object.keys(account).map((net) => {
            const network = net as Network;
            const isSelected = showingNetwork === network;
            return (
              <button
                key={network}
                type="button"
                className={cn(
                  "border h-8 py-2 px-2.5 rounded-lg leading-none capitalize flex items-center justify-center",
                  isSelected
                    ? "pointer-events-none highlight-teal"
                    : "highlight-zinc hover:bg-secondary"
                )}
                onClick={() => setShowingNetwork(network)}
              >
                {network}
              </button>
            );
          })}
        </div>

        {hasMultipleAccounts && (
          <div className="flex items-center gap-3">
            {(isSwitching || !isActive) && (
              <Tooltip
                content={isSwitching ? "Switching..." : "Set as Active"}
                position="left"
              >
                <button
                  type="button"
                  className={cn("icon-btn-bg-sm hover:text-teal-500", {
                    "bg-secondary pointer-events-none": isSwitching,
                  })}
                  onClick={() => switchActiveAccount(accountIndex)}
                  disabled={isSwitching}
                  aria-label="Set as Active Account"
                >
                  {isSwitching ? <Loader size="sm" /> : <Check />}
                </button>
              </Tooltip>
            )}

            <div className="flex flex-col items-end">
              <Tooltip
                content={removeState === "want" ? "Cancel" : "Remove Account"}
                position="left"
              >
                <button
                  className={cn("icon-btn-bg-sm", {
                    "hover:text-rose-500": removeState === "no",
                    "bg-secondary": removeState === "want",
                  })}
                  onClick={() =>
                    setRemoveState((prev) => (prev === "want" ? "no" : "want"))
                  }
                  aria-label={
                    removeState === "want"
                      ? "Cancel Account Removal"
                      : "Remove Account"
                  }
                >
                  {removeState === "want" ? <Cancel /> : <Trash />}
                </button>
              </Tooltip>

              <AnimatePresence>
                {removeState === "want" && (
                  <motion.div
                    className="max-w-60 absolute z-50 top-full mt-2 bg-default border rounded-lg shadow-xl overflow-hidden"
                    {...expandCollapseAnimation({
                      duration: 0.15,
                      ease: "easeOut",
                    })}
                  >
                    <div className="flex flex-col items-center gap-2 text-center p-3 bg-input">
                      <p className="leading-snug text-15">
                        Are you sure you want to remove this account?
                      </p>
                      <button
                        type="button"
                        className="px-2 py-1 border highlight-rose rounded-lg text-sm"
                        onClick={handleAccountRemove}
                        aria-label="Remove Account"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      <NetworkDetails network={showingNetwork} {...account[showingNetwork]} />
    </motion.div>
  );
};

export default AccountCard;
