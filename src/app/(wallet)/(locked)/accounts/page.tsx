"use client";
import { useTransition, useState } from "react";
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
import { useAccounts, useClipboard } from "@/hooks";
import {
  Loader,
  NetworkLogo,
  Tooltip,
  CopyToggle,
  EyeToggle,
} from "@/components/ui";
import { Cards, Plus, Trash, AngleDown, Check } from "@/components/ui/icons";
import parseBalance from "@/utils/parseBalance";

const ManageAccountsPage = () => {
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

  const [creating, startCreating] = useTransition();
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [openedAccounts, setOpenedAccounts] = useState<number[]>([
    activeAccountIndex,
  ]);
  const [togglingAccountCard, setTogglingAccountCard] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showingFullTexts, setShowingFullTexts] = useState<string[]>([]);

  const handleToggle = (index: number) => {
    if (togglingAccountCard) return;
    setTogglingAccountCard(true);
    setOpenedAccounts((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
    setTimeout(() => setTogglingAccountCard(false), 300);
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
    } catch (error) {
      notify({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete account. Please try again.",
      });
    } finally {
      setDeletingIndex(null);
    }
  };

  const handleCopy = (text: string) => {
    copyToClipboard(text, copiedText === text, (copied) => {
      setCopiedText(copied ? text : null);
    });
  };

  const handleToggleFullText = (text: string) => {
    setShowingFullTexts((prev) =>
      prev.includes(text) ? prev.filter((t) => t !== text) : [...prev, text]
    );
  };

  return (
    <div className="w-full max-w-screen-lg relative flex flex-col items-center gap-8 flex-1">
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
          {Object.entries(accounts).map(([key, account], idx) => {
            const accountIndex = parseInt(key);
            const isOpen = openedAccounts.includes(accountIndex);
            const deleting = deletingIndex === accountIndex;
            const switching = switchingToAccount === accountIndex;

            return (
              <motion.div
                key={`account-${accountIndex}`}
                className={cn(
                  "w-full relative rounded-4xl border-1.5 border-color",
                  { "overflow-hidden": togglingAccountCard }
                )}
                {...fadeUpAnimation({ delay: idx * 0.1 + 0.1 })}
              >
                <div
                  className="w-full relative flex items-center justify-between gap-4 p-4 pl-5 cursor-pointer"
                  onClick={() => handleToggle(accountIndex)}
                >
                  <div className="flex items-center gap-2 pl-1">
                    <h3 className="text-xl font-medium heading-color pr-2">
                      Account {accountIndex + 1}
                    </h3>
                    <span className="text-sm font-medium leading-none uppercase tracking-wide px-2 h-7.5 flex items-center justify-center rounded-lg bg-primary border border-color">
                      Index {accountIndex}
                    </span>
                    {accountIndex === activeAccountIndex && (
                      <span className="text-sm font-medium leading-none uppercase tracking-wide px-2 h-7.5 flex items-center justify-center rounded-lg bg-teal-500/10 text-teal-500 border border-teal-500/30 dark:border-teal-500/10">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isOpen && Object.keys(accounts).length > 1 && (
                      <>
                        {(switching || accountIndex !== activeAccountIndex) && (
                          <Tooltip
                            content={
                              switching ? "Switching..." : "Set Active Account"
                            }
                          >
                            <button
                              className={cn("icon-btn-bg", {
                                "bg-primary cursor-default pointer-events-none":
                                  switching,
                              })}
                              onClick={async (e) => {
                                e.stopPropagation();
                                await switchActiveAccount(accountIndex);
                              }}
                              disabled={switching}
                            >
                              {switching ? <Loader size="sm" /> : <Check />}
                            </button>
                          </Tooltip>
                        )}

                        <Tooltip content="Remove Account">
                          <button
                            className={cn("icon-btn-bg", {
                              "cursor-default bg-primary pointer-events-none":
                                deleting,
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
                    className="w-full relative"
                  >
                    <div className="w-full p-5 pt-0 grid grid-cols-2 gap-4">
                      {Object.entries(account).map(
                        ([networkKey, { address, privateKey, balance }]) => {
                          const network = networkKey as TNetwork;
                          const networkConfig = NETWORKS[network];
                          const parsedBalance = parseBalance(balance);

                          return (
                            <div
                              key={`account-${accountIndex}-${network}`}
                              className="w-full relative flex flex-col items-start gap-3 rounded-3xl bg-primary p-5"
                            >
                              <div className="w-full flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <NetworkLogo network={network} size="sm" />
                                  <h4 className="text-lg font-medium heading-color">
                                    {`${networkConfig.name}${
                                      networkMode === "testnet"
                                        ? ` ${NETWORKS[network].testnetName}`
                                        : ""
                                    }`}
                                  </h4>
                                </div>

                                {parsedBalance.wasRounded ? (
                                  <Tooltip
                                    content={`${parsedBalance.original} ${networkConfig.token}`}
                                  >
                                    <p className="text-md font-semibold leading-none cursor-default">
                                      {parsedBalance.display}{" "}
                                      {networkConfig.token}
                                    </p>
                                  </Tooltip>
                                ) : (
                                  <p className="text-md font-semibold leading-none">
                                    {parsedBalance.display}{" "}
                                    {networkConfig.token}
                                  </p>
                                )}
                              </div>

                              <div className="w-full flex flex-col gap-1">
                                <div className="w-full flex items-center justify-between gap-8">
                                  <h5 className="leading-none text-md heading-color font-medium">
                                    Address
                                  </h5>

                                  <div className="min-w-fit flex items-center gap-4">
                                    <Tooltip
                                      content={
                                        showingFullTexts.includes(address)
                                          ? "Hide Full address"
                                          : "Show Full address"
                                      }
                                    >
                                      <EyeToggle
                                        isVisible={showingFullTexts.includes(
                                          address
                                        )}
                                        onClick={() =>
                                          handleToggleFullText(address)
                                        }
                                      />
                                    </Tooltip>
                                    <Tooltip
                                      content={
                                        copiedText === address
                                          ? "Copied!"
                                          : "Copy Address"
                                      }
                                    >
                                      <CopyToggle
                                        hasCopied={copiedText === address}
                                        onClick={() => handleCopy(address)}
                                      />
                                    </Tooltip>
                                  </div>
                                </div>

                                <p className="break-all max-w-[85%]">
                                  {showingFullTexts.includes(address)
                                    ? address
                                    : getShortAddress(address, network, 10)}
                                </p>
                              </div>

                              <div className="w-full flex flex-col gap-1">
                                <div className="w-full flex items-center justify-between gap-8">
                                  <h5 className="leading-none text-md heading-color font-medium">
                                    Private Key
                                  </h5>

                                  <div className="min-w-fit flex items-center gap-4">
                                    <Tooltip
                                      content={
                                        showingFullTexts.includes(privateKey)
                                          ? "Hide Full Private Key"
                                          : "Show Full Private Key"
                                      }
                                    >
                                      <EyeToggle
                                        isVisible={showingFullTexts.includes(
                                          privateKey
                                        )}
                                        onClick={() =>
                                          handleToggleFullText(privateKey)
                                        }
                                      />
                                    </Tooltip>
                                    <Tooltip
                                      content={
                                        copiedText === privateKey
                                          ? "Copied!"
                                          : "Copy Private Key"
                                      }
                                    >
                                      <CopyToggle
                                        hasCopied={copiedText === privateKey}
                                        onClick={() => handleCopy(privateKey)}
                                      />
                                    </Tooltip>
                                  </div>
                                </div>

                                <p className="break-all">
                                  {showingFullTexts.includes(privateKey)
                                    ? privateKey
                                    : privateKey.slice(0, 25) + "..."}
                                </p>
                              </div>
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

export default ManageAccountsPage;
