"use client";
import { useState, useTransition } from "react";
import { motion } from "motion/react";
import {
  useAccountsStore,
  useWalletStore,
  useNotificationStore,
} from "@/stores";
import { useAccounts, useBlockchain, useClipboard } from "@/hooks";
import { TNetwork } from "@/types";
import { Button, Loader, Tooltip } from "@/components/ui";
import {
  Wallet,
  WalletMoney,
  Eye,
  EyeSlash,
  Check,
} from "@/components/ui/icons";
import { NetworkCard, AccountSwitcher } from "@/components/wallet";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { RecoveryPhrase } from "@/components/settings";

const AccountsPage = () => {
  const accounts = useAccountsStore((state) => state.accounts);
  const activeAccountIndex = useAccountsStore(
    (state) => state.activeAccountIndex
  );
  const setActiveAccountIndex = useAccountsStore(
    (state) => state.setActiveAccountIndex
  );
  const updateBalances = useAccountsStore((state) => state.updateBalances);
  const networkMode = useWalletStore((state) => state.networkMode);
  const notify = useNotificationStore((state) => state.notify);

  const { createAccount } = useAccounts();
  const { fetchBalance } = useBlockchain();
  const copyToClipboard = useClipboard();
  const [creating, startCreating] = useTransition();
  const [refreshing, setRefreshing] = useState<Set<string>>(new Set());
  const [balancesVisible, setBalancesVisible] = useState(true);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const accountsList = Object.entries(accounts).map(([index, account]) => ({
    index: parseInt(index),
    account,
  }));
  const handleCreateAccount = () => {
    startCreating(async () => {
      try {
        await createAccount();
        notify({
          type: "success",
          message: "New account created successfully!",
          duration: 3000,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create account";
        notify({
          type: "error",
          message,
          duration: 4000,
        });
      }
    });
  };
  const handleRefreshBalance = async (
    accountIndex: number,
    network: TNetwork
  ) => {
    const account = accounts[accountIndex];
    if (!account) return;

    const refreshKey = `${accountIndex}-${network}`;
    setRefreshing((prev) => new Set(prev).add(refreshKey));

    try {
      const balance = await fetchBalance({
        network,
        address: account[network].address,
      });
      updateBalances(accountIndex, {
        ethereum: account.ethereum.balance,
        solana: account.solana.balance,
        [network]: balance,
      } as Record<TNetwork, string>);

      notify({
        type: "success",
        message: `${
          network.charAt(0).toUpperCase() + network.slice(1)
        } balance updated`,
        duration: 2000,
      });
    } catch (error) {
      notify({
        type: "error",
        message: `Failed to refresh ${network} balance`,
        duration: 3000,
      });
    } finally {
      setRefreshing((prev) => {
        const newSet = new Set(prev);
        newSet.delete(refreshKey);
        return newSet;
      });
    }
  };

  const handleRefreshBalances = async (accountIndex: number) => {
    const account = accounts[accountIndex];
    if (!account) return;

    setRefreshing((prev) => new Set(prev).add(accountIndex.toString()));

    try {
      const ethBalance = await fetchBalance({
        network: "ethereum",
        address: account.ethereum.address,
      });

      const solBalance = await fetchBalance({
        network: "solana",
        address: account.solana.address,
      });

      updateBalances(accountIndex, {
        ethereum: ethBalance,
        solana: solBalance,
      });

      notify({
        type: "success",
        message: "Balances updated successfully",
        duration: 2000,
      });
    } catch (error) {
      notify({
        type: "error",
        message: "Failed to refresh balances",
        duration: 3000,
      });
    } finally {
      setRefreshing((prev) => {
        const newSet = new Set(prev);
        newSet.delete(accountIndex.toString());
        return newSet;
      });
    }
  };
  const handleCopyAddress = async (address: string, network: TNetwork) => {
    const key = `${address}-${network}`;
    const success = await copyToClipboard(
      address,
      copiedStates[key] || false,
      (copied) => {
        setCopiedStates((prev) => ({ ...prev, [key]: copied as boolean }));
      }
    );

    if (success) {
      notify({
        type: "success",
        message: `${
          network.charAt(0).toUpperCase() + network.slice(1)
        } address copied!`,
        duration: 2000,
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col py-10 gap-6">
      <motion.div className="w-full flex flex-col gap-4" {...fadeUpAnimation()}>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold heading-color">Accounts</h1>
          {networkMode === "devnet" && (
            <span className="bg-warning px-3 py-1.5 rounded-xl text-sm font-medium">
              Testnet Mode
            </span>
          )}
        </div>

        <p className="text-color">
          Manage your wallet accounts and view balances across different
          networks
        </p>
      </motion.div>
      <RecoveryPhrase />
      {/* Summary Card */}
      <motion.div
        className="border-2 border-color rounded-3xl p-6 bg-primary/30"
        {...fadeUpAnimation({ delay: 0.1 })}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
              <WalletMoney className="w-6 h-6 text-teal-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold heading-color">
                Total Accounts
              </h2>
              <p className="text-color">Manage your wallet accounts</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Tooltip
              content={balancesVisible ? "Hide Balances" : "Show Balances"}
            >
              <button
                className="icon-btn-bg"
                onClick={() => setBalancesVisible(!balancesVisible)}
              >
                {balancesVisible ? (
                  <EyeSlash className="w-5" />
                ) : (
                  <Eye className="w-5" />
                )}
              </button>
            </Tooltip>

            <Button
              variant="teal"
              onClick={handleCreateAccount}
              disabled={creating}
            >
              {creating ? (
                <>
                  <Loader size="sm" />
                  Creating...
                </>
              ) : (
                <>
                  <Wallet className="w-4" />
                  Create Account
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold heading-color">
              {accountsList.length}
            </div>
            <div className="text-sm text-color">Total Accounts</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold heading-color">
              {accountsList.length * 2}
            </div>
            <div className="text-sm text-color">Network Addresses</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-teal-500">
              Account {activeAccountIndex}
            </div>
            <div className="text-sm text-color">Active Account</div>
          </div>
        </div>
      </motion.div>
      {/* Current Account Switcher */}
      <motion.div
        className="w-full max-w-sm"
        {...fadeUpAnimation({ delay: 0.2 })}
      >
        <AccountSwitcher variant="dropdown" />
      </motion.div>{" "}
      {/* Accounts List with NetworkCards */}
      <motion.div className="space-y-6" {...fadeUpAnimation({ delay: 0.3 })}>
        {accountsList.map((item, index) => (
          <motion.div
            key={item.index}
            className={cn(
              "border-2 rounded-3xl p-6 bg-primary/30 transition-all",
              item.index === activeAccountIndex
                ? "border-teal-500 bg-teal-500/10"
                : "border-color hover:border-teal-500/50"
            )}
            {...fadeUpAnimation({ delay: 0.1 * index })}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    item.index === activeAccountIndex
                      ? "bg-teal-500 text-white"
                      : "bg-primary border-2 border-color"
                  )}
                >
                  {item.index === activeAccountIndex ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <Wallet className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold heading-color">
                    Account {item.index}
                    {item.index === activeAccountIndex && (
                      <span className="ml-2 text-sm text-teal-500 font-medium">
                        (Active)
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-color">
                    Multi-network wallet account
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {item.index !== activeAccountIndex && (
                  <Button
                    variant="zinc"
                    onClick={() => setActiveAccountIndex(item.index)}
                  >
                    <Check className="w-4" />
                    Activate
                  </Button>
                )}{" "}
                <Button
                  variant="zinc"
                  onClick={() => handleRefreshBalances(item.index)}
                  disabled={refreshing.has(item.index.toString())}
                >
                  {refreshing.has(item.index.toString()) ? (
                    <Loader size="sm" />
                  ) : (
                    "Refresh"
                  )}
                </Button>
              </div>
            </div>{" "}
            {/* Network Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(["ethereum", "solana"] as TNetwork[]).map((network) => {
                const networkAccount = item.account[network];
                const refreshKey = `${item.index}-${network}`;
                const addressKey = `${networkAccount.address}-${network}`;
                const isCopied = copiedStates[addressKey] || false;

                return (
                  <NetworkCard
                    key={network}
                    network={network}
                    address={networkAccount.address}
                    balance={networkAccount.balance}
                  />
                );
              })}
            </div>
          </motion.div>
        ))}
      </motion.div>
      {accountsList.length === 0 && (
        <motion.div
          className="border-2 border-dashed border-color rounded-3xl p-12 text-center"
          {...fadeUpAnimation({ delay: 0.4 })}
        >
          <Wallet className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-semibold heading-color mb-2">
            No accounts found
          </h3>
          <p className="text-color mb-6">
            Create your first account to start using your wallet
          </p>
          <Button
            variant="teal"
            onClick={handleCreateAccount}
            disabled={creating}
          >
            {creating ? (
              <>
                <Loader size="sm" />
                Creating Account...
              </>
            ) : (
              <>
                <Wallet className="w-4" />
                Create First Account
              </>
            )}
          </Button>
        </motion.div>
      )}
      {/* Account Management Info */}
      <motion.div
        className="border border-blue-500/30 bg-blue-500/10 rounded-2xl p-4"
        {...fadeUpAnimation({ delay: 0.5 })}
      >
        <div className="flex gap-3">
          <div className="text-blue-500 mt-0.5">ℹ️</div>
          <div className="text-sm">
            <p className="font-medium text-blue-800 dark:text-blue-500 mb-1">
              Account Management Tips:
            </p>
            <ul className="space-y-1 text-blue-700 dark:text-blue-400">
              <li>• Each account has both Ethereum and Solana addresses</li>
              <li>• You can switch between accounts anytime</li>
              <li>• All accounts are derived from your recovery phrase</li>
              <li>• Refresh balances to get the latest amounts</li>
              {networkMode === "devnet" && (
                <li>• You're on testnet - these are test tokens only</li>
              )}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountsPage;
