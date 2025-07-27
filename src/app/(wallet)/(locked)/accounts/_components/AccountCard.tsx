"use client";
import { useState } from "react";
import { motion } from "motion/react";
import type { Account, Network } from "@/types";
import {
  useAccountsStore,
  useClipboardStore,
  useNotificationStore,
} from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import delay from "@/utils/delay";
import { useAccounts } from "@/hooks";
import { Trash, Check, Cancel, Key } from "@/components/icons";
import {
  Button,
  CopyToggle,
  EyeToggle,
  Loader,
  Modal,
  NetworkLogo,
  Tooltip,
} from "@/components/ui";
import { NETWORKS } from "@/config";

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
  const copiedId = useClipboardStore((state) => state.copiedId);
  const copyToClipboard = useClipboardStore((state) => state.copyToClipboard);
  const notify = useNotificationStore((state) => state.notify);

  const [removalState, setRemovalState] = useState<
    "idle" | "confirming" | "removing"
  >("idle");

  const [showingPrivateKey, setShowingPrivateKey] = useState<{
    network: Network;
    privateKey: string;
  } | null>(null);

  const [isPrivateKeyVisible, setIsPrivateKeyVisible] = useState(false);

  const isConfirmingRemoval = removalState === "confirming";
  const isRemovingAccount = removalState === "removing";
  const isSwitching = switchingToAccount === accountIndex;
  const networkEntries = Object.entries(account);

  const { switchActiveAccount, deleteAccount } = useAccounts();

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

  const handlePrivateKeyClose = () => {
    setShowingPrivateKey(null);
    setIsPrivateKeyVisible(false);
  };

  const handleCopyPrivateKey = async () => {
    if (!showingPrivateKey) return;

    const copyId = `private-key-${showingPrivateKey.network}-${accountIndex}`;
    try {
      await copyToClipboard(copyId, showingPrivateKey.privateKey);
      notify({
        type: "success",
        message: "Private key copied to clipboard",
      });
    } catch {
      notify({
        type: "error",
        message: "Failed to copy private key",
      });
    }
  };

  return (
    <motion.div
      className="w-full relative rounded-3xl border-1.5"
      {...fadeUpAnimation({ delay: accountIndex * 0.05 })}
    >
      <div className="w-full relative flex items-center justify-between gap-4 border-b-1.5 pl-4 pr-2 py-2">
        <div className="flex items-center gap-3">
          <span className="text-primary sm:text-xl text-lg font-medium leading-none">
            Account {accountIndex + 1}
          </span>
          {isActive && (
            <span className="highlight-teal border text-sm font-medium uppercase leading-none p-2 rounded-lg whitespace-nowrap">
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
                  className={cn("icon-btn-bg", {
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

            <Tooltip
              content={
                isConfirmingRemoval ? "Cancel Removal" : "Remove Account"
              }
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
                aria-label={
                  isConfirmingRemoval ? "Cancel Removal" : "Remove Account"
                }
              >
                {isConfirmingRemoval ? <Cancel /> : <Trash />}
              </button>
            </Tooltip>
          </div>
        )}
      </div>

      <div className="w-full relative grid sm:grid-cols-2 grid-cols-1">
        {networkEntries.map(([networkKey, { address, privateKey }], index) => {
          const network = networkKey as Network;
          const { name } = NETWORKS[network];
          const totalItems = networkEntries.length;

          const showBottomBorderSm =
            index < totalItems - (totalItems % 2 === 0 ? 2 : 1);
          const showBottomBorderMobile = index < totalItems - 1;

          return (
            <div
              key={`account-${accountIndex}-${network}-card`}
              className={cn("w-full relative flex flex-col gap-2 p-4", {
                "sm:border-r-1.5": index % 2 === 0,
                "border-b-1.5 sm:border-b-0": showBottomBorderMobile,
                "sm:border-b-1.5": showBottomBorderSm,
              })}
            >
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <NetworkLogo network={network} size="sm" />
                  <h3 className="text-lg font-medium text-primary leading-none">
                    {name}
                  </h3>
                </div>
                <button
                  type="button"
                  className="icon-btn-bg-sm"
                  onClick={() => {
                    setShowingPrivateKey({ network, privateKey });
                    setIsPrivateKeyVisible(false);
                  }}
                  aria-label={`View ${name} Private Key`}
                >
                  <Key />
                </button>
              </div>

              <div>
                <h4 className="text-lg font-medium text-primary">Address</h4>
                <p className="break-all text-sm">{address}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Private Key Modal */}
      <Modal
        isOpen={!!showingPrivateKey}
        onClose={handlePrivateKeyClose}
        className="max-w-md"
      >
        {showingPrivateKey && (
          <>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <NetworkLogo network={showingPrivateKey.network} size="sm" />
                <h2 className="text-xl font-medium text-primary">
                  {NETWORKS[showingPrivateKey.network].name} Private Key
                </h2>
              </div>
              <p className="text-sm text-secondary">
                Account {accountIndex + 1} •{" "}
                {NETWORKS[showingPrivateKey.network].name} Network
              </p>
            </div>

            <div className="w-full bg-input border rounded-2xl">
              <div className="flex items-center justify-between p-3 border-b">
                <h4 className="text-sm font-medium text-secondary">
                  Private Key
                </h4>
                <EyeToggle
                  isVisible={isPrivateKeyVisible}
                  onClick={() => setIsPrivateKeyVisible((prev) => !prev)}
                />
              </div>

              <div className="text-left p-3">
                {isPrivateKeyVisible ? (
                  <p className="break-all text-sm font-mono">
                    {showingPrivateKey.privateKey}
                  </p>
                ) : (
                  <p className="text-sm text-secondary">
                    Click the eye icon to reveal private key
                  </p>
                )}
              </div>

              {isPrivateKeyVisible && (
                <CopyToggle
                  className="w-full justify-center p-3 border-t"
                  labels={{ copied: "Copied!", copy: "Copy Private Key" }}
                  hasCopied={
                    copiedId ===
                    `private-key-${showingPrivateKey.network}-${accountIndex}`
                  }
                  onClick={handleCopyPrivateKey}
                />
              )}
            </div>

            <div className="w-full highlight-yellow border rounded-2xl p-4">
              <div className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 text-lg leading-none mt-0.5">
                  ⚠️
                </span>
                <div className="text-left">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                    Security Warning
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Never share your private key. Anyone with access to it can
                    control your funds. Make sure you're in a secure environment
                    before revealing it.
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="zinc"
              size="sm"
              className="w-full"
              onClick={handlePrivateKeyClose}
              aria-label="Close Private Key Modal"
            >
              Close
            </Button>
          </>
        )}
      </Modal>

      {/* Account Removal Modal */}
      <Modal
        isOpen={isRemovingAccount || isConfirmingRemoval}
        onClose={() => setRemovalState("idle")}
        closeOnOutsideClick={!isRemovingAccount}
      >
        <h2 className="text-xl font-medium text-primary">
          Remove Account {accountIndex + 1}
        </h2>
        <div className="w-full flex flex-col items-center gap-2">
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
        <div className="w-full flex items-center justify-center gap-3 mt-3">
          <Button
            variant="zinc"
            size="sm"
            className="flex-1"
            onClick={() => setRemovalState("idle")}
            aria-label="Cancel Removal"
          >
            Cancel
          </Button>
          <Button
            variant="rose"
            size="sm"
            className="flex-1"
            onClick={handleAccountRemove}
            disabled={isRemovingAccount}
            aria-label="Confirm Account Removal"
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
