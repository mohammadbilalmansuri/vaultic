"use client";
import { useTransition, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TNetwork } from "@/types";
import {
  useWalletStore,
  useAccountsStore,
  useNotificationStore,
} from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { useAccounts, useClipboard } from "@/hooks";
import { Loader, Tooltip } from "@/components/ui";
import { Cards, Plus, Trash, AngleDown, Check } from "@/components/ui/icons";
import { NetworkCard } from "@/components/wallet";

const ManageAccountsPage = () => {
  const networkMode = useWalletStore((state) => state.networkMode);
  const accounts = useAccountsStore((state) => state.accounts);
  const activeAccountIndex = useAccountsStore(
    (state) => state.activeAccountIndex
  );

  const notify = useNotificationStore((state) => state.notify);
  const { createAccount, deleteAccount, switchActiveAccount } = useAccounts();
  const copyToClipboard = useClipboard();

  const [creating, startCreating] = useTransition();
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [openedAccounts, setOpenedAccounts] = useState<number[]>([
    activeAccountIndex,
  ]);

  const handleToggle = (index: number) => {
    setOpenedAccounts((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCreateAccount = () => {
    startCreating(async () => {
      try {
        await createAccount();
        notify({
          type: "success",
          message: "New account created successfully.",
        });
      } catch {
        notify({
          type: "error",
          message: "Failed to create new account. Please try again.",
        });
      }
    });
  };

  const handleDeleteAccount = async (index: number) => {
    if (deletingIndex !== null) return;
    setDeletingIndex(index);
    try {
      await deleteAccount(index);
      notify({
        type: "success",
        message: `Account ${index + 1} deleted successfully.`,
      });
      handleToggle(index);
    } catch {
      notify({
        type: "error",
        message: `Failed to delete account ${index + 1}. Please try again.`,
      });
    } finally {
      setDeletingIndex(null);
    }
  };

  return (
    <div className="w-full max-w-screen-lg relative flex flex-col gap-8 flex-1">
      <motion.div
        className="w-full relative flex items-center justify-between gap-4"
        {...fadeUpAnimation()}
      >
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-teal-500/10 flex items-center justify-center">
            <Cards className="w-6 text-teal-500" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold heading-color">
              Manage Accounts
            </h2>
            <p>
              Manage all your indexed, derived accounts from your recovery
              phrase.
            </p>
          </div>
        </div>
        <Tooltip content={creating ? "Creating..." : "Create New Account"}>
          <button
            className={cn("icon-btn-bg size-11", {
              "cursor-default bg-primary": creating,
            })}
            onClick={handleCreateAccount}
            disabled={creating}
          >
            {creating ? <Loader size="sm" /> : <Plus className="w-7" />}
          </button>
        </Tooltip>
      </motion.div>

      <div className="w-full relative flex flex-col gap-6">
        <AnimatePresence>
          {Object.entries(accounts).map(([key, account], idx) => {
            const accountIndex = parseInt(key);
            const isOpen = openedAccounts.includes(accountIndex);
            const deleting = deletingIndex === accountIndex;

            return (
              <motion.div
                key={`account-${accountIndex}`}
                className={cn(
                  "w-full relative rounded-4xl border-1.5",
                  accountIndex === activeAccountIndex
                    ? "border-focus"
                    : "border-color"
                )}
                {...fadeUpAnimation({ delay: idx * 0.1 + 0.1 })}
              >
                <div
                  className="w-full relative flex items-center justify-between gap-4 p-4 pl-5 cursor-pointer"
                  onClick={() => handleToggle(accountIndex)}
                >
                  <div className="flex items-center gap-4 pl-1">
                    <h3 className="text-xl font-medium heading-color">
                      Account {accountIndex + 1}
                    </h3>
                    {accountIndex === activeAccountIndex && (
                      <span className="text-sm font-medium leading-none uppercase tracking-wide px-2.5 h-8 flex items-center justify-center rounded-lg bg-teal-500/10 text-teal-500 border border-teal-500/30 dark:border-teal-500/10">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isOpen && Object.keys(accounts).length > 1 && (
                      <>
                        {accountIndex !== activeAccountIndex && (
                          <Tooltip content="Set Active Account">
                            <button
                              className="icon-btn-bg"
                              onClick={(e) => {
                                e.stopPropagation();
                                switchActiveAccount(accountIndex);
                              }}
                            >
                              <Check />
                            </button>
                          </Tooltip>
                        )}

                        <Tooltip content="Remove Account">
                          <button
                            className={cn("icon-btn-bg", {
                              "cursor-default bg-primary": deleting,
                            })}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (deleting) return;
                              handleDeleteAccount(accountIndex);
                            }}
                            disabled={deleting}
                          >
                            {deleting ? <Loader size="sm" /> : <Trash />}
                          </button>
                        </Tooltip>
                      </>
                    )}

                    <Tooltip
                      containerClassName="icon-btn-bg"
                      content={isOpen ? "Collapse" : "Expand"}
                    >
                      <AngleDown
                        className={cn("transition-all duration-300", {
                          "rotate-180": isOpen,
                        })}
                      />
                    </Tooltip>
                  </div>
                </div>

                <AnimatePresence>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="w-full p-5 pt-0 grid grid-cols-2 gap-4">
                      {Object.entries(account).map(
                        ([network, { address, privateKey, balance }]) => (
                          <NetworkCard
                            key={`account-${accountIndex}-${network}`}
                            network={network as TNetwork}
                            networkMode={networkMode}
                            address={address}
                            balance={balance}
                            privateKey={privateKey}
                          />
                        )
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ManageAccountsPage;
