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
import { useAccounts } from "@/hooks";
import { Trash, Check, Cancel, Key } from "@/components/icons";
import {
  Tooltip,
  Button,
  NetworkLogo,
  Modal,
  Loader,
  CopyToggle,
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

  const { switchActiveAccount, deleteAccount } = useAccounts();

  const [removalState, setRemovalState] = useState<
    "idle" | "confirming" | "removing"
  >("idle");
  const [showingNetwork, setShowingNetwork] = useState<Network | null>(null);

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
      className="w-full relative rounded-3xl border-1.5 flex flex-col gap-3 p-4"
      {...fadeUpAnimation({ delay: accountIndex * 0.05 })}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-primary sm:text-xl text-lg font-medium">
            Account {accountIndex + 1}
          </span>
          {isActive && (
            <span className="highlight-teal border text-sm font-medium uppercase p-2 rounded-lg">
              Active
            </span>
          )}
        </div>

        {hasMultipleAccounts && (
          <div className="flex items-center gap-2 -mr-1 -mt-1">
            {(isSwitching || !isActive) && (
              <Tooltip
                content={isSwitching ? "Switching..." : "Set as Active"}
                position="left"
              >
                <button
                  className={cn("icon-btn-bg", {
                    "bg-secondary pointer-events-none": isSwitching,
                  })}
                  onClick={() => switchActiveAccount(accountIndex)}
                  disabled={isSwitching}
                  aria-label="Switch to this account"
                >
                  {isSwitching ? <Loader size="sm" /> : <Check />}
                </button>
              </Tooltip>
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
      </div>

      {/* Networks List */}
      <div className="grid sm:grid-cols-2 gap-4">
        {Object.entries(account).map(
          ([networkKey, { address, privateKey }]) => {
            const network = networkKey as Network;
            const { name } = NETWORKS[network];
            const copyId = `${accountIndex}-${network}-key`;

            return (
              <div
                key={copyId}
                className="flex flex-col gap-2 p-4 bg-primary rounded-2xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <NetworkLogo network={network} size="sm" />
                    <h3 className="text-lg font-medium">{name}</h3>
                  </div>
                  <button
                    className="icon-btn-bg-sm"
                    onClick={() => setShowingNetwork(network)}
                    aria-label={`Show private key for ${name}`}
                  >
                    <Key />
                  </button>
                </div>

                <div>
                  <h4 className="text-lg font-medium">Address</h4>
                  <p className="break-all text-sm">{address}</p>
                </div>

                <Modal
                  isOpen={showingNetwork === network}
                  onClose={() => setShowingNetwork(null)}
                  className="gap-4"
                >
                  <h2 className="text-primary text-xl font-medium">
                    Private Key - {name}
                  </h2>
                  <p className="highlight-yellow border rounded-2xl p-3">
                    Never share your private key. Anyone with access to it can
                    control your funds.
                  </p>
                  <div className="bg-input border rounded-2xl">
                    <p className="text-primary p-4 break-all">{privateKey}</p>
                    <CopyToggle
                      className="w-full justify-center p-3 border-t"
                      labels={{ copied: "Copied!", copy: "Copy" }}
                      hasCopied={copiedId === copyId}
                      onClick={() => copyToClipboard(privateKey, copyId)}
                    />
                  </div>
                  <Button
                    variant="zinc"
                    className="w-full"
                    onClick={() => setShowingNetwork(null)}
                  >
                    Close
                  </Button>
                </Modal>
              </div>
            );
          }
        )}
      </div>

      {/* Account Remove Confirmation Modal */}
      <Modal
        isOpen={isConfirmingRemoval}
        onClose={() => setRemovalState("idle")}
        className="gap-4"
      >
        <h2 className="text-xl font-medium text-primary">
          Remove Account {accountIndex + 1}
        </h2>
        <div className="w-full flex flex-col text-center gap-2">
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
