"use client";
import { useState } from "react";
import { motion } from "motion/react";
import type { Account, Network } from "@/types";
import { useSwitchingToAccount, useNotificationActions } from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { useAccountManager } from "@/hooks";
import { Trash, Check, Cancel } from "@/components/icons";
import { Tooltip, Button, Modal, Loader } from "@/components/ui";
import { NetworkCard } from "@/components/shared";

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
  const switchingToAccount = useSwitchingToAccount();
  const { notify } = useNotificationActions();

  const { switchActiveAccount, deleteAccount } = useAccountManager();

  const [removalState, setRemovalState] = useState<
    "idle" | "confirming" | "removing"
  >("idle");

  const isSwitching = switchingToAccount === accountIndex;
  const isConfirmingRemoval = removalState === "confirming";
  const isRemovingAccount = removalState === "removing";

  const handleAccountRemove = async () => {
    if (!isConfirmingRemoval) return;
    setRemovalState("removing");

    try {
      await deleteAccount(accountIndex);
      notify({
        type: "success",
        message: `Account ${accountIndex + 1} removed.`,
      });
    } catch {
      notify({ type: "error", message: "Failed to remove account" });
    } finally {
      setRemovalState("idle");
    }
  };

  return (
    <motion.div
      className={cn(
        "w-full relative rounded-3xl border-1.5 flex flex-col items-center gap-3 p-4",
        { "pt-8.5": !hasMultipleAccounts }
      )}
      {...fadeUpAnimation({ delay: accountIndex * 0.05 })}
    >
      <div className="text-primary uppercase font-medium leading-[0.8] h-9 p-2.5 flex items-center justify-center border-1.5 rounded-lg absolute -top-4.5 bg-default whitespace-normal">
        Account {accountIndex + 1}
      </div>

      {hasMultipleAccounts && (
        <div className="w-full flex items-center justify-between gap-4 -mt-1">
          {isSwitching || !isActive ? (
            <Tooltip
              content={isSwitching ? "Switching..." : "Set as Active"}
              position="left"
            >
              <button
                className={cn("icon-btn-bg hover:text-teal-500", {
                  "bg-secondary pointer-events-none": isSwitching,
                })}
                onClick={() => switchActiveAccount(accountIndex)}
                disabled={isSwitching}
                aria-label="Switch to this account"
              >
                {isSwitching ? <Loader size="sm" /> : <Check className="w-6" />}
              </button>
            </Tooltip>
          ) : (
            <span className="highlight-teal border text-sm font-medium leading-none uppercase p-2 rounded-lg">
              Active
            </span>
          )}

          <Tooltip
            content={isConfirmingRemoval ? "Cancel" : "Remove"}
            position="left"
          >
            <button
              className={cn("icon-btn-bg", {
                "hover:text-rose-500": removalState === "idle",
              })}
              onClick={() =>
                setRemovalState((prev) =>
                  prev === "confirming" ? "idle" : "confirming"
                )
              }
              aria-label="Remove Account"
            >
              {isConfirmingRemoval ? <Cancel /> : <Trash />}
            </button>
          </Tooltip>
        </div>
      )}

      <div className="w-full relative grid sm:grid-cols-2 gap-4">
        {Object.entries(account).map(([network, networkData]) => (
          <NetworkCard
            key={`${accountIndex}-${network}-card`}
            network={network as Network}
            isFor="accounts"
            {...networkData}
          />
        ))}
      </div>

      <Modal
        isOpen={isConfirmingRemoval}
        onClose={() => setRemovalState("idle")}
        className="gap-4"
      >
        <h2 className="xs:text-xl text-lg font-medium text-primary leading-none">
          Remove Account {accountIndex + 1}
        </h2>
        <div className="w-full flex flex-col text-center gap-1.5">
          <p>
            Removing this account only deletes it from Vaultic — it still exists
            on the blockchain and may hold funds.
          </p>
          <p>
            Deleted accounts cannot be recreated automatically. Vaultic does not
            reuse account indexes.
          </p>
          <p>
            To restore it later, reset your wallet and re-import using your
            recovery phrase.
          </p>
        </div>
        <div className="w-full flex items-center xs:gap-3 gap-2 mt-2">
          <Button
            variant="zinc"
            className="flex-1"
            onClick={() => setRemovalState("idle")}
            aria-label="Cancel removal"
          >
            Cancel
          </Button>
          <Button
            variant="rose"
            className="flex-1"
            onClick={handleAccountRemove}
            disabled={isRemovingAccount}
            aria-label="Confirm removal"
          >
            {isRemovingAccount ? (
              <Loader size="sm" color="current" />
            ) : (
              "Remove"
            )}
          </Button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default AccountCard;
