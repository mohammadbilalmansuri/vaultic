"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DEFAULT_NETWORK } from "@/constants";
import type { Account, Network } from "@/types";
import { useAccountsStore, useNotificationStore } from "@/stores";
import {
  fadeInAnimation,
  fadeUpAnimation,
  scaleUpAnimation,
} from "@/utils/animations";
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

  const [removalState, setRemovalState] = useState<
    "idle" | "confirming" | "removing"
  >("idle");

  const isConfirmingRemoval = removalState === "confirming";
  const isRemovingAccount = removalState === "removing";

  const { switchActiveAccount, deleteAccount } = useAccounts();

  const removeModalRef = useOutsideClick<HTMLDivElement>(() => {
    if (isConfirmingRemoval) setRemovalState("idle");
  }, isConfirmingRemoval);

  const isSwitching = switchingToAccount === accountIndex;

  const handleAccountRemove = async () => {
    if (!isConfirmingRemoval) return;
    setRemovalState("removing");

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
      setRemovalState("idle");
    }
  };

  return (
    <motion.div
      className="w-full relative rounded-3xl border-1.5 flex flex-col items-center md:gap-4 gap-3 md:p-4 p-3"
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
                  "border h-8 py-2 px-2.5 rounded-lg leading-none capitalize flex items-center justify-center transition-all duration-200",
                  isSelected
                    ? "pointer-events-none highlight-teal"
                    : "highlight-zinc hover:bg-secondary"
                )}
                onClick={() => setShowingNetwork(network)}
                disabled={isSelected}
                aria-label={`See ${network} details`}
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
                  className={cn("icon-btn-bg-sm", {
                    "bg-secondary pointer-events-none": isSwitching,
                  })}
                  onClick={() => switchActiveAccount(accountIndex)}
                  disabled={isSwitching}
                  aria-label="Set as Active Account"
                >
                  {isSwitching ? <Loader size="xs" /> : <Check />}
                </button>
              </Tooltip>
            )}

            <div className="relative">
              <Tooltip
                content={
                  isConfirmingRemoval ? "Cancel Removal" : "Remove Account"
                }
                position="left"
              >
                <button
                  className={cn("icon-btn-bg-sm", {
                    "hover:text-rose-500": removalState === "idle",
                  })}
                  onClick={() =>
                    setRemovalState((prev) =>
                      prev === "confirming" ? "idle" : "confirming"
                    )
                  }
                  aria-label={
                    isConfirmingRemoval ? "Cancel Removal" : "Remove Account"
                  }
                >
                  {isConfirmingRemoval ? <Cancel /> : <Trash />}
                </button>
              </Tooltip>

              <AnimatePresence>
                {(isRemovingAccount || isConfirmingRemoval) && (
                  <motion.div
                    className="fixed inset-0 z-40 bg-zinc-950/50 flex items-center justify-center"
                    {...fadeInAnimation()}
                  >
                    <motion.div
                      ref={removeModalRef}
                      className="bg-default rounded-3xl md:p-6 p-5 w-full max-w-sm border shadow-xl text-center m-4 flex flex-col items-center md:gap-4 gap-3"
                      {...scaleUpAnimation({ delay: 0.15 })}
                    >
                      <h2 className="text-xl font-medium text-primary">
                        Remove Account {accountIndex + 1}
                      </h2>
                      <div className="w-full flex flex-col gap-2">
                        <p>
                          Removing this account only deletes it from Vaultic —
                          it still exists on the blockchain and may hold funds.
                        </p>
                        <p>
                          Deleted accounts cannot be recreated automatically.
                          Vaultic does{" "}
                          <strong>not reuse account indexes</strong>.
                        </p>
                        <p>
                          To restore it later, reset your wallet and re-import
                          using your recovery phrase.
                        </p>
                      </div>
                      <div className="w-full flex items-center justify-center gap-4 pt-2">
                        <button
                          type="button"
                          className="flex-1 py-2 rounded-xl bg-secondary font-medium"
                          onClick={() => setRemovalState("idle")}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="flex-1 py-2 rounded-xl bg-rose-500 text-zinc-200 font-medium flex items-center justify-center"
                          onClick={handleAccountRemove}
                          disabled={isRemovingAccount}
                        >
                          {isRemovingAccount ? (
                            <Loader size="sm" color="current" />
                          ) : (
                            "Remove"
                          )}
                        </button>
                      </div>
                    </motion.div>
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
