"use client";
import { useTransition, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  useWalletStore,
  useAccountsStore,
  useNotificationStore,
} from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import { useAccounts, useClipboard } from "@/hooks";
import { Button, Loader, Tooltip } from "@/components/ui";
import {
  Cards,
  Plus,
  Trash,
  AngleDown,
  Copy,
  Eye,
  EyeSlash,
  Check,
} from "@/components/ui/icons";
import cn from "@/utils/cn";
import NetworkLogo from "@/components/ui/NetworkLogo";
import CopyToggle from "@/components/ui/CopyToggle";
import parseBalance from "@/utils/parseBalance";
import getShortAddress from "@/utils/getShortAddress";
import { NETWORKS } from "@/config/networks";
import { TNetwork } from "@/types";

const ManageAccountsPage = () => {
  const notify = useNotificationStore((state) => state.notify);
  const accounts = useAccountsStore((state) => state.accounts);
  const activeAccountIndex = useAccountsStore(
    (state) => state.activeAccountIndex
  );
  const activeAccount = useAccountsStore((state) => state.getActiveAccount());

  const { createAccount, deleteAccount, switchActiveAccount } = useAccounts();
  const copyToClipboard = useClipboard();

  const [creating, startCreating] = useTransition();
  const [deleting, startDeleting] = useTransition();
  const [expandedCards, setExpandedCards] = useState<Set<number>>(
    new Set([activeAccountIndex])
  );
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<Set<string>>(
    new Set()
  );
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});

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

  const handleDeleteAccount = (index: number) => {
    startDeleting(async () => {
      try {
        await deleteAccount(index);
        notify({
          type: "success",
          message: `Account ${index + 1} deleted successfully.`,
        });
      } catch {
        notify({
          type: "error",
          message: `Failed to delete account ${index + 1}. Please try again.`,
        });
      }
    });
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
            <p className="text-zinc-500 text-sm">
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

      <div className="w-full relative flex flex-col gap-4">
        <AnimatePresence>
          {Object.entries(accounts).map(([key, account]) => {
            const index = parseInt(key);
            return <></>;
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ManageAccountsPage;
