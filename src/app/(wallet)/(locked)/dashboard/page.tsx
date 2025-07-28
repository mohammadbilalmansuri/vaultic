"use client";
import { useTransition } from "react";
import { motion } from "motion/react";
import type { Network, TabsData } from "@/types";
import {
  useNetworkMode,
  useActiveAccountIndex,
  useAccountActions,
  useSwitchingToAccount,
  useNotificationActions,
} from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { useBlockchain } from "@/hooks";
import { Send, QR, Clock, Refresh } from "@/components/icons";
import { NetworkCard, Tabs } from "@/components/shared";
import { Loader, Tooltip } from "@/components/ui";
import SendTab from "./_components/SendTab";
import ReceiveTab from "./_components/ReceiveTab";
import TransactionsTab from "./_components/TransactionsTab";

const TABS: TabsData = [
  { label: "Send", icon: Send, panel: SendTab },
  { label: "Receive", icon: QR, panel: ReceiveTab },
  { label: "Transactions", icon: Clock, panel: TransactionsTab },
];

const DashboardPage = () => {
  const networkMode = useNetworkMode();
  const activeAccountIndex = useActiveAccountIndex();
  const activeAccount = useAccountActions().getActiveAccount();
  const switchingToAccount = useSwitchingToAccount();
  const { notify } = useNotificationActions();

  const { fetchActiveAccountBalances } = useBlockchain();
  const [refreshing, startRefreshing] = useTransition();

  const accountNumber = activeAccountIndex + 1;
  const accountLabel = `Account ${accountNumber}`;

  const handleBalanceRefresh = () => {
    startRefreshing(async () => {
      try {
        await fetchActiveAccountBalances();
        notify({
          type: "success",
          message: "Balances refreshed successfully!",
        });
      } catch {
        notify({
          type: "error",
          message: "Failed to refresh balances",
        });
      }
    });
  };

  if (switchingToAccount !== null) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-8 text-center flex-1"
        role="status"
        aria-live="polite"
      >
        <Loader />
        <p className="sm:text-lg">
          Switching to Account {switchingToAccount + 1}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-lg relative flex flex-col sm:gap-6 gap-5">
      <motion.div
        className="w-full relative flex items-center justify-between gap-4"
        {...fadeUpAnimation()}
      >
        <div className="flex items-center gap-4">
          <span
            className="highlight-teal size-12 rounded-xl border flex items-center justify-center shrink-0 font-semibold uppercase text-xl"
            aria-label={`${accountLabel} identifier`}
          >
            A{accountNumber}
          </span>
          <div>
            <h1 className="text-xl font-semibold text-primary">
              {accountLabel}
            </h1>
            <p className="text-sm sm:text-base">
              {networkMode === "testnet"
                ? "Safe to explore - these are test assets only"
                : "Live network - real funds at stake"}
            </p>
          </div>
        </div>

        <Tooltip
          content={refreshing ? "Refreshing..." : "Refresh Balances"}
          position="left"
        >
          <button
            type="button"
            className={cn("icon-btn-bg", {
              "bg-secondary pointer-events-none": refreshing,
            })}
            onClick={handleBalanceRefresh}
            disabled={refreshing}
            aria-label={
              refreshing ? "Refreshing balances..." : "Refresh account balances"
            }
          >
            {refreshing ? <Loader size="sm" /> : <Refresh />}
          </button>
        </Tooltip>
      </motion.div>

      <motion.div
        className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5"
        {...fadeUpAnimation({ delay: 0.05 })}
      >
        {Object.entries(activeAccount).map(([network, networkData]) => (
          <NetworkCard
            key={`${network}-card`}
            isFor="dashboard"
            network={network as Network}
            refreshingBalance={refreshing}
            {...networkData}
          />
        ))}
      </motion.div>

      <Tabs tabs={TABS} delay={{ list: 0.1, panel: 0.15 }} />
    </div>
  );
};

export default DashboardPage;
