"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { NETWORKS } from "@/config";
import type { Account, Network } from "@/types";
import { useAccountsStore, useNotificationStore } from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { useAccounts } from "@/hooks";
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
  const { switchActiveAccount, deleteAccount } = useAccounts();

  const [removing, setRemoving] = useState<
    "no" | "want" | "confirm" | "removing"
  >("no");

  const isSwitching = switchingToAccount === accountIndex;

  const handleAccountRemove = async () => {
    if (removing !== "confirm") return;
    setRemoving("removing");

    try {
      await deleteAccount(accountIndex);
      notify({
        type: "success",
        message: `Account ${accountIndex} removed successfully.`,
      });
    } catch {
      notify({
        type: "error",
        message: "Failed to remove account. Please try again.",
      });
    } finally {
      setRemoving("no");
    }
  };

  return (
    <motion.div
      className="w-full relative rounded-3xl border-1.5 p-3 flex flex-col gap-3"
      {...fadeUpAnimation({ delay: accountIndex * 0.05 })}
    >
      <div className="w-full relative flex items-center justify-between gap-3 pl-2">
        <div className="flex items-center gap-3">
          <h2 className="sm:text-xl text-lg font-semibold text-primary">
            Account {accountIndex + 1}
          </h2>
          {isActive && (
            <span className="highlight-teal border sm:text-sm text-xs font-medium uppercase leading-none px-2.5 py-1.5 rounded-lg whitespace-nowrap">
              Active
            </span>
          )}
        </div>

        {hasMultipleAccounts && (
          <div className="flex items-center gap-2">
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

            <div className="relative flex items-center">
              <Tooltip
                content={removing === "want" ? "Cancel" : "Remove Account"}
                position="left"
              >
                <button
                  className={cn("icon-btn-bg-sm", {
                    "hover:text-rose-500": removing !== "no",
                  })}
                  onClick={() =>
                    setRemoving((prev) => (prev === "want" ? "no" : "want"))
                  }
                  aria-label={
                    removing === "want"
                      ? "Cancel Account Removal"
                      : "Remove Account"
                  }
                >
                  {removing === "want" ? <Cancel /> : <Trash />}
                </button>
              </Tooltip>

              <AnimatePresence>
                {removing === "confirm" && (
                  <motion.div
                    className="absolute z-50 top-full mt-2 bg-secondary rounded-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <div className="flex items-center justify-between text-center p-3">
                      <p>Confirm Account Removal</p>
                      <button
                        type="button"
                        className="px-2 py-1 hightlight-rose rounded-lg"
                        onClick={handleAccountRemove}
                        aria-label="Confirm Delete"
                      >
                        Confirm
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      <div className="w-full relative grid grid-cols-2 gap-3">
        {Object.entries(account).map(([network, details], index) => (
          <NetworkDetails
            key={network}
            network={network as Network}
            {...details}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default AccountCard;
