"use client";
import { useTransition } from "react";
import { motion } from "motion/react";
import { useAccountsStore, useNotificationStore } from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { useAccounts } from "@/hooks";
import { Wallet, Plus } from "@/components/icons";
import { Loader, Tooltip } from "@/components/ui";
import AccountCard from "./_components/AccountCard";

const AccountsPage = () => {
  const accounts = useAccountsStore((state) => state.accounts);
  const activeAccountIndex = useAccountsStore(
    (state) => state.activeAccountIndex
  );
  const notify = useNotificationStore((state) => state.notify);

  const { createAccount } = useAccounts();
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

      <div className="w-full relative flex flex-col md:gap-10 gap-9">
        {accountEntries.map(([key, account]) => {
          const accountIndex = parseInt(key);
          const isActive = accountIndex === activeAccountIndex;
          return (
            <AccountCard
              key={`account-${accountIndex}`}
              accountIndex={accountIndex}
              account={account}
              isActive={isActive}
              hasMultipleAccounts={hasMultipleAccounts}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AccountsPage;
