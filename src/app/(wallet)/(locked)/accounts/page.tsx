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
import { Wallet, Plus, Trash, AngleDown, Check } from "@/components/icons";
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

  const handleAccountCardToggle = (event: MouseEvent, index: number) => {
    if (
      event.target instanceof Element &&
      !event.target.closest("[data-clickable]")
    ) {
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
    <div className="w-full max-w-screen-lg relative flex flex-col md:gap-6 gap-5">
      <motion.div
        className="w-full relative flex items-center justify-between gap-3"
        {...fadeUpAnimation()}
      >
        <div className="flex items-center sm:gap-3 gap-2.5">
          <span
            className="highlight-teal sm:size-12 size-11 rounded-xl border hidden xs:flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <Wallet className="w-6" />
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

      <div className="w-full relative flex flex-col md:gap-6 gap-5">
        {accountEntries.map(([key, account], index) => {
          const accountIndex = parseInt(key);
          const networkEntries = Object.entries(account);
          const isActive = accountIndex === activeAccountIndex;
          const isOpen = openedAccounts.has(accountIndex);
          const isRemoving = removingIndex === accountIndex;
          const isSwitching = switchingToAccount === accountIndex;

          return (
            <motion.div
              key={`account-${accountIndex}`}
              className="w-full relative rounded-3xl border-1.5"
              {...fadeUpAnimation({ delay: index * 0.05 + 0.05 })}
            >
              <div
                className="w-full relative flex items-center justify-between gap-3 md:py-4 py-3 md:pl-5 pl-4 pr-2 cursor-pointer"
                onClick={(e) => handleAccountCardToggle(e, accountIndex)}
              >
                <div className="flex items-center gap-3">
                  <h2 className="sm:text-xl text-lg font-medium text-primary leading-[0.8]">
                    Account {accountIndex + 1}
                  </h2>

                  {isActive && (
                    <span className="highlight-teal border sm:text-sm text-xs font-medium uppercase leading-none p-2 pb-1.75 rounded-lg whitespace-nowrap">
                      Active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isOpen && hasMultipleAccounts && (
                    <>
                      {(isSwitching || !isActive) && (
                        <Tooltip
                          content={
                            isSwitching ? "Switching..." : "Set Active Account"
                          }
                        >
                          <button
                            className={cn("icon-btn-bg hover:text-teal-500", {
                              "bg-secondary pointer-events-none": isSwitching,
                            })}
                            onClick={() => switchActiveAccount(accountIndex)}
                            disabled={isSwitching}
                            aria-label="Switch Account"
                            data-clickable
                          >
                            {isSwitching ? <Loader size="sm" /> : <Check />}
                          </button>
                        </Tooltip>
                      )}
                      <Tooltip content="Remove Account">
                        <button
                          className={cn("icon-btn-bg hover:text-rose-500", {
                            "bg-secondary pointer-events-none": isRemoving,
                          })}
                          onClick={() => handleRemoveAccount(accountIndex)}
                          disabled={isRemoving}
                          aria-label="Remove Account"
                          data-clickable
                        >
                          {isRemoving ? <Loader size="sm" /> : <Trash />}
                        </button>
                      </Tooltip>
                    </>
                  )}
                  <div
                    className="icon-btn-bg"
                    aria-label="Toggle Account Details"
                    aria-expanded={isOpen}
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
                    key={`account-details-${accountIndex}`}
                    className="w-full relative overflow-hidden"
                    {...expandCollapseAnimation()}
                  >
                    <div className="w-full grid md:grid-cols-2 grid-cols-1 md:gap-5 gap-4 md:px-5 px-4 md:pb-5 pb-4">
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
                              className="col-span-1 flex flex-col gap-3 rounded-2xl bg-primary sm:p-5 xxs:p-4 p-3.5"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <NetworkLogo network={network} size="sm" />
                                  <h3 className="sm:text-lg text-md font-medium text-primary">
                                    {networkDisplayName}
                                  </h3>
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
                                    <div className="w-full flex justify-between items-center gap-3">
                                      <h4 className="sm:text-md font-medium text-primary leading-none">
                                        {label}
                                      </h4>
                                      <div className="flex items-center gap-4">
                                        <Tooltip
                                          content={
                                            isVisible
                                              ? `Hide Full ${label}`
                                              : `Show Full ${label}`
                                          }
                                          position="left"
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
                                          position="left"
                                        >
                                          <CopyToggle
                                            hasCopied={copied}
                                            onClick={() => handleCopy(value)}
                                          />
                                        </Tooltip>
                                      </div>
                                    </div>
                                    <p
                                      className={cn(
                                        isVisible ? "break-all" : "truncate"
                                      )}
                                    >
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
