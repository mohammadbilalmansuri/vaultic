"use client";
import { useTransition, useState, MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NETWORKS } from "@/config";
import { TNetwork } from "@/types";
import {
  useWalletStore,
  useAccountsStore,
  useNotificationStore,
} from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import getShortAddress from "@/utils/getShortAddress";
import parseBalance from "@/utils/parseBalance";
import { useAccounts, useClipboard } from "@/hooks";
import {
  Loader,
  NetworkLogo,
  Tooltip,
  CopyToggle,
  EyeToggle,
} from "@/components/ui";
import { Cards, Plus, Trash, AngleDown, Check } from "@/components/ui/icons";

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

  const [creating, startCreating] = useTransition();
  const { createAccount, deleteAccount, switchActiveAccount } = useAccounts();
  const copyToClipboard = useClipboard();

  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  const [openedAccounts, setOpenedAccounts] = useState<Set<number>>(
    new Set([activeAccountIndex])
  );
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showingFullTexts, setShowingFullTexts] = useState<Set<string>>(
    new Set()
  );
  const [togglingAccountCard, setTogglingAccountCard] = useState(false);

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

  const handleRemoveAccount = async (e: MouseEvent, index: number) => {
    e.stopPropagation();
    if (removingIndex !== null) return;
    setRemovingIndex(index);

    try {
      await deleteAccount(index);
      notify({
        type: "success",
        message: `Account ${index + 1} deleted successfully.`,
      });
      setOpenedAccounts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
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

  const handleSwitchActiveAccount = async (
    e: MouseEvent,
    accountIndex: number
  ) => {
    e.stopPropagation();
    await switchActiveAccount(accountIndex);
  };

  const handleAccountCardToggle = (index: number) => {
    if (togglingAccountCard) return;
    setTogglingAccountCard(true);

    setOpenedAccounts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });

    setTimeout(() => setTogglingAccountCard(false), 300);
  };

  const handleFullTextToggle = (text: string) => {
    setShowingFullTexts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(text)) {
        newSet.delete(text);
      } else {
        newSet.add(text);
      }
      return newSet;
    });
  };

  const handleCopy = (text: string) => {
    copyToClipboard(text, copiedText === text, (copied) => {
      setCopiedText(copied ? text : null);
    });
  };

  const accountEntries = Object.entries(accounts);
  const hasMultipleAccounts = accountEntries.length > 1;

  return (
    <div className="w-full max-w-screen-lg relative flex flex-col gap-6 flex-1">
      <motion.div
        className="w-full relative flex items-center justify-between gap-4"
        {...fadeUpAnimation()}
      >
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-teal-500/10 flex items-center justify-center">
            <Cards className="w-6 text-teal-500" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold heading-color">Accounts</h2>
            <p className="text-secondary">Add, remove, or switch accounts.</p>
          </div>
        </div>

        <Tooltip content={creating ? "Creating..." : "Create New Account"}>
          <button
            className={cn("icon-btn-bg", {
              "cursor-default bg-primary pointer-events-none": creating,
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
          {accountEntries.map(([key, account], idx) => {
            const accountIndex = parseInt(key);
            const isOpen = openedAccounts.has(accountIndex);
            const isDeleting = removingIndex === accountIndex;
            const isSwitching = switchingToAccount === accountIndex;
            const isActive = accountIndex === activeAccountIndex;

            return (
              <motion.div
                key={`account-${accountIndex}`}
                className="w-full relative rounded-4xl border-1.5 border-color"
                {...fadeUpAnimation({ delay: idx * 0.1 + 0.1 })}
              >
                <div
                  className="w-full relative flex items-center justify-between gap-4 p-4 pl-5 cursor-pointer"
                  onClick={() => handleAccountCardToggle(accountIndex)}
                >
                  <div className="flex items-center gap-2 pl-1">
                    <h3 className="text-xl font-medium heading-color pr-2">
                      Account {accountIndex + 1}
                    </h3>

                    <span className="text-sm font-medium leading-none uppercase tracking-wide px-2 h-7.5 flex items-center justify-center rounded-lg bg-primary border border-color">
                      Index {accountIndex}
                    </span>

                    {isActive && (
                      <span className="text-sm font-medium leading-none uppercase tracking-wide px-2 h-7.5 flex items-center justify-center rounded-lg bg-teal-500/10 text-teal-500 border border-teal-500/30 dark:border-teal-500/10">
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
                              isSwitching
                                ? "Switching..."
                                : "Set Active Account"
                            }
                          >
                            <button
                              className={cn("icon-btn-bg hover:text-teal-500", {
                                "bg-primary cursor-default pointer-events-none":
                                  isSwitching,
                              })}
                              onClick={(e) =>
                                handleSwitchActiveAccount(e, accountIndex)
                              }
                              disabled={isSwitching}
                            >
                              {isSwitching ? <Loader size="sm" /> : <Check />}
                            </button>
                          </Tooltip>
                        )}

                        <Tooltip content="Remove Account">
                          <button
                            className={cn("icon-btn-bg hover:text-rose-500", {
                              "cursor-default bg-primary pointer-events-none":
                                isDeleting,
                            })}
                            onClick={(e) =>
                              handleRemoveAccount(e, accountIndex)
                            }
                            disabled={isDeleting}
                          >
                            {isDeleting ? <Loader size="sm" /> : <Trash />}
                          </button>
                        </Tooltip>
                      </>
                    )}

                    <button className="icon-btn-bg">
                      <AngleDown
                        className={cn("transition-all duration-300", {
                          "rotate-180": isOpen,
                        })}
                      />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn("w-full relative", {
                      "overflow-hidden": togglingAccountCard,
                    })}
                  >
                    <div className="w-full p-5 pt-0 grid grid-cols-2 gap-4">
                      {Object.entries(account).map(
                        ([networkKey, { address, privateKey, balance }]) => {
                          const network = networkKey as TNetwork;
                          const networkConfig = NETWORKS[network];
                          const parsedBalance = parseBalance(balance);
                          const isAddressVisible =
                            showingFullTexts.has(address);
                          const isPrivateKeyVisible =
                            showingFullTexts.has(privateKey);
                          const isAddressCopied = copiedText === address;
                          const isPrivateKeyCopied = copiedText === privateKey;

                          const networkDisplayName = `${networkConfig.name}${
                            networkMode === "testnet"
                              ? ` ${networkConfig.testnetName}`
                              : ""
                          }`;

                          const balanceElement = (
                            <p className="text-md font-semibold leading-none cursor-default">
                              {parsedBalance.display} {networkConfig.token}
                            </p>
                          );

                          return (
                            <div
                              key={`account-${accountIndex}-${network}`}
                              className="w-full relative flex flex-col items-start gap-3 rounded-3xl bg-primary p-5"
                            >
                              <div className="w-full flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <NetworkLogo network={network} size="sm" />
                                  <h4 className="text-lg font-medium heading-color">
                                    {networkDisplayName}
                                  </h4>
                                </div>

                                {parsedBalance.wasRounded ? (
                                  <Tooltip
                                    content={`${parsedBalance.original} ${networkConfig.token}`}
                                  >
                                    {balanceElement}
                                  </Tooltip>
                                ) : (
                                  balanceElement
                                )}
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
                                  isVisible: isAddressVisible,
                                  copied: isAddressCopied,
                                },
                                {
                                  label: "Private Key",
                                  value: privateKey,
                                  shortValue: `${privateKey.slice(0, 25)}...`,
                                  isVisible: isPrivateKeyVisible,
                                  copied: isPrivateKeyCopied,
                                },
                              ].map(
                                ({
                                  label,
                                  value,
                                  isVisible,
                                  copied,
                                  shortValue,
                                }) => (
                                  <div
                                    key={label}
                                    className="w-full flex flex-col gap-1"
                                  >
                                    <div className="w-full flex items-center justify-between gap-8">
                                      <h5 className="leading-none text-md heading-color font-medium">
                                        {label}
                                      </h5>

                                      <div className="min-w-fit flex items-center gap-4">
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
                                )
                              )}
                            </div>
                          );
                        }
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

export default AccountsPage;
