"use client";
import { useTransition, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NETWORKS } from "@/config";
import type { MouseEvent } from "react";
import type { Network } from "@/types";
import {
  useWalletStore,
  useAccountsStore,
  useNotificationStore,
} from "@/stores";
import { expandCollapseAnimation, fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import getShortAddress from "@/utils/getShortAddress";
import parseBalance from "@/utils/parseBalance";
import { useAccounts, useClipboard } from "@/hooks";
import { Cards, Plus, Trash, AngleDown, Check } from "@/components/icons";
import {
  Loader,
  NetworkLogo,
  Tooltip,
  CopyToggle,
  EyeToggle,
} from "@/components/ui";

const AccountsPage = () => {
  const networkMode = useWalletStore((state) => state.networkMode);
  const accounts = useAccountsStore((state) => state.accounts);
  const activeAccountIndex = useAccountsStore(
    (state) => state.activeAccountIndex
  );
  const switchingToAccount = useAccountsStore(
    (state) => state.switchingToAccount
  );
  const notify = useNotificationStore((state) => state.notify);

  const { createAccount, deleteAccount, switchActiveAccount } = useAccounts();
  const copyToClipboard = useClipboard();

  const [openedAccounts, setOpenedAccounts] = useState<Set<number>>(
    new Set([activeAccountIndex])
  );
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  const [showingFullTexts, setShowingFullTexts] = useState<Set<string>>(
    new Set()
  );
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [creating, startCreating] = useTransition();

  const accountEntries = Object.entries(accounts);
  const hasMultipleAccounts = accountEntries.length > 1;

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

  const handleRemoveAccount = async (index: number) => {
    if (removingIndex !== null) return;
    setRemovingIndex(index);
    try {
      await deleteAccount(index);
      setOpenedAccounts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
      notify({
        type: "success",
        message: `Account ${index + 1} deleted successfully.`,
      });
    } catch (error) {
      notify({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete account. Please try again.",
      });
    } finally {
      setRemovingIndex(null);
    }
  };

  const handleAccountCardToggle = (e: MouseEvent, index: number) => {
    if (e.target instanceof Element && !e.target.closest("[data-clickable]")) {
      setOpenedAccounts((prev) => {
        const newSet = new Set(prev);
        newSet.has(index) ? newSet.delete(index) : newSet.add(index);
        return newSet;
      });
    }
  };

  const handleFullTextToggle = (text: string) => {
    setShowingFullTexts((prev) => {
      const newSet = new Set(prev);
      newSet.has(text) ? newSet.delete(text) : newSet.add(text);
      return newSet;
    });
  };

  const handleCopy = (text: string) => {
    copyToClipboard(text, copiedText === text, (copied) => {
      setCopiedText(copied ? text : null);
    });
  };

  return (
    <div className="w-full max-w-screen-lg relative flex flex-col sm:gap-6 gap-5">
      <motion.div
        className="w-full relative flex items-center justify-between gap-3"
        {...fadeUpAnimation()}
      >
        <div className="flex items-center sm:gap-3 gap-2.5">
          <span
            className="highlight-teal sm:size-12 size-11 rounded-xl border hidden xs:flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <Cards className="w-6" />
          </span>
          <div>
            <h1 className="sm:text-xl text-lg font-semibold text-primary">
              Accounts
            </h1>
            <p className="sm:text-base text-sm">
              Add, remove, or switch accounts.
            </p>
          </div>
        </div>

        <Tooltip
          content={creating ? "Creating..." : "Create New Account"}
          position="left"
        >
          <button
            type="button"
            className={cn("icon-btn-bg", {
              "bg-secondary pointer-events-none": creating,
            })}
            onClick={handleCreateAccount}
            disabled={creating}
            aria-label="Create New Account"
          >
            {creating ? <Loader size="sm" /> : <Plus className="w-7" />}
          </button>
        </Tooltip>
      </motion.div>

      <div className="w-full relative flex flex-col gap-6">
        {accountEntries.map(([key, account], index) => {
          const accountIndex = parseInt(key);
          const isActive = accountIndex === activeAccountIndex;
          const isOpen = openedAccounts.has(accountIndex);
          const isDeleting = removingIndex === accountIndex;
          const isSwitching = switchingToAccount === accountIndex;
          const networkEntries = Object.entries(account);

          return (
            <motion.div
              key={`account-${accountIndex}`}
              className="w-full relative rounded-4xl border-1.5"
              {...fadeUpAnimation({ delay: index * 0.05 + 0.05 })}
            >
              <div
                className="w-full relative flex items-center justify-between gap-4 p-4 pl-5 cursor-pointer"
                onClick={(e) => handleAccountCardToggle(e, accountIndex)}
              >
                <div className="flex items-center gap-2 pl-1">
                  <h3 className="text-xl font-medium text-primary pr-2">
                    Account {accountIndex + 1}
                  </h3>

                  <span className="text-sm font-medium uppercase tracking-wide p-2 h-7.5 flex items-center justify-center rounded-lg bg-primary border">
                    Index {accountIndex}
                  </span>

                  {isActive && (
                    <span className="text-sm font-medium uppercase tracking-wide p-2 h-7.5 flex items-center justify-center rounded-lg bg-teal-500/10 text-teal-500 border border-teal-500/30 dark:border-teal-500/10">
                      Active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isOpen && hasMultipleAccounts && (
                    <AnimatePresence>
                      {(isSwitching || !isActive) && (
                        <motion.div
                          key={`switch-btn-${accountIndex}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Tooltip
                            content={
                              isSwitching
                                ? "Switching..."
                                : "Set Active Account"
                            }
                          >
                            <button
                              className={cn("icon-btn-bg hover:text-teal-500", {
                                "bg-secondary pointer-events-none": isSwitching,
                              })}
                              onClick={() => switchActiveAccount(accountIndex)} //
                              disabled={isSwitching}
                              aria-label="Switch Account"
                              data-clickable
                            >
                              {isSwitching ? <Loader size="sm" /> : <Check />}
                            </button>
                          </Tooltip>
                        </motion.div>
                      )}

                      <motion.div
                        key={`remove-btn-${accountIndex}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Tooltip content="Remove Account">
                          <button
                            className={cn("icon-btn-bg hover:text-rose-500", {
                              "bg-secondary pointer-events-none": isDeleting,
                            })}
                            onClick={() => handleRemoveAccount(accountIndex)} //
                            disabled={isDeleting}
                            aria-label="Remove Account"
                            data-clickable
                          >
                            {isDeleting ? <Loader size="sm" /> : <Trash />}
                          </button>
                        </Tooltip>
                      </motion.div>
                    </AnimatePresence>
                  )}
                  <div
                    className="icon-btn-bg"
                    aria-label="Toggle Details"
                    aria-expanded={isOpen}
                    aria-controls={`account-details-${accountIndex}`}
                  >
                    <AngleDown
                      className={cn("transition-all duration-200", {
                        "rotate-180": isOpen,
                      })}
                    />
                  </div>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`account-details-${accountIndex}`}
                    className="w-full relative overflow-hidden"
                    {...expandCollapseAnimation()}
                  >
                    <div className="w-full p-5 pt-0 grid md:grid-cols-2 grid-cols-1 gap-4">
                      {networkEntries.map(
                        ([networkKey, { address, privateKey, balance }]) => {
                          const network = networkKey as Network;
                          const networkConfig = NETWORKS[network];
                          const parsedBalance = parseBalance(balance);
                          const networkDisplayName = `${networkConfig.name}${
                            networkMode === "testnet"
                              ? ` ${networkConfig.testnetName}`
                              : ""
                          }`;

                          return (
                            <div
                              key={`account-${accountIndex}-${network}`}
                              className="col-span-1 flex flex-col gap-3 rounded-3xl bg-primary p-5"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <NetworkLogo network={network} size="sm" />
                                  <h4 className="text-lg font-medium text-primary">
                                    {networkDisplayName}
                                  </h4>
                                </div>
                                <Tooltip
                                  content={
                                    parsedBalance.wasRounded
                                      ? `${parsedBalance.original} ${networkConfig.token}`
                                      : undefined
                                  }
                                  position="left"
                                >
                                  <p className="text-md font-semibold leading-none cursor-default">{`${parsedBalance.display} ${networkConfig.token}`}</p>
                                </Tooltip>
                              </div>

                              {[
                                {
                                  label: "Address",
                                  value: address,
                                  shortValue: getShortAddress(
                                    address,
                                    network,
                                    10
                                  ),
                                },
                                {
                                  label: "Private Key",
                                  value: privateKey,
                                  shortValue: `${privateKey.slice(0, 25)}...`,
                                },
                              ].map(({ label, value, shortValue }) => {
                                const isVisible = showingFullTexts.has(value);
                                const copied = copiedText === value;
                                return (
                                  <div
                                    key={label}
                                    className="flex flex-col gap-1"
                                  >
                                    <div className="flex justify-between items-center gap-8">
                                      <h5 className="text-md font-medium text-primary">
                                        {label}
                                      </h5>
                                      <div className="flex items-center gap-4">
                                        <Tooltip
                                          content={
                                            isVisible
                                              ? `Hide Full ${label}`
                                              : `Show Full ${label}`
                                          }
                                        >
                                          <EyeToggle
                                            isVisible={isVisible}
                                            onClick={() =>
                                              handleFullTextToggle(value)
                                            }
                                          />
                                        </Tooltip>
                                        <Tooltip
                                          content={
                                            copied ? "Copied!" : `Copy ${label}`
                                          }
                                        >
                                          <CopyToggle
                                            hasCopied={copied}
                                            onClick={() => handleCopy(value)}
                                          />
                                        </Tooltip>
                                      </div>
                                    </div>
                                    <p className="break-all max-w-[85%]">
                                      {isVisible ? value : shortValue}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AccountsPage;
