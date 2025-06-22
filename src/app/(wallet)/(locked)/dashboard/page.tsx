"use client";
import { useTransition } from "react";
import { motion } from "motion/react";
import { TNetwork, TTabs } from "@/types";
import {
  useWalletStore,
  useAccountsStore,
  useNotificationStore,
} from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import { useBlockchain } from "@/hooks";
import { Loader, Tooltip, Tabs } from "@/components/ui";
import { Send, QR, Clock, Refresh, Wallet } from "@/components/ui/icons";
import { NetworkCard } from "@/components/wallet";
import { SendTab, ReceiveTab, ActivityTab } from "@/components/dashboard";
import cn from "@/utils/cn";

const TABS: TTabs = {
  Send: { icon: Send, content: SendTab },
  Receive: { icon: QR, content: ReceiveTab },
  Activity: { icon: Clock, content: ActivityTab },
} as const;

const DashboardPage = () => {
  const notify = useNotificationStore((state) => state.notify);
  const networkMode = useWalletStore((state) => state.networkMode);
  const activeAccountIndex = useAccountsStore(
    (state) => state.activeAccountIndex
  );
  const activeAccount = useAccountsStore((state) => state.getActiveAccount());
  const switchingToAccount = useAccountsStore(
    (state) => state.switchingToAccount
  );

  const { refreshActiveAccount } = useBlockchain();
  const [refreshing, startRefreshing] = useTransition();

  const handleRefresh = () => {
    startRefreshing(async () => {
      try {
        await refreshActiveAccount();
        notify({
          type: "success",
          message: "Balances and activities refreshed successfully!",
        });
      } catch {
        notify({
          type: "error",
          message: "Failed to refresh balances and activities.",
        });
      }
    });
  };

  if (switchingToAccount !== null) {
    return (
      <div className="size-full flex flex-col items-center justify-center gap-8">
        <Loader />
        <p className="text-lg">Switching to Account {switchingToAccount + 1}</p>
      </div>
    );
  }

  const lastNetworkCardDelay = Object.keys(activeAccount).length * 0.1;

  return (
    <div className="w-full max-w-screen-lg relative flex flex-col gap-8 flex-1">
      <motion.div
        className="w-full relative flex items-center justify-between gap-4"
        {...fadeUpAnimation()}
      >
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-teal-500/10 flex items-center justify-center">
            <Wallet className="w-6 text-teal-500" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold heading-color">
              Account {activeAccountIndex + 1} Dashboard
            </h2>
            <p>
              {networkMode === "testnet"
                ? "Safe to explore — these are test assets only"
                : "Live network — real funds at stake"}
            </p>
          </div>
        </div>

        <Tooltip
          content={refreshing ? "Refreshing..." : "Refresh balances & activity"}
        >
          <button
            className={cn("icon-btn-bg size-11", {
              "cursor-default bg-primary": refreshing,
            })}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? <Loader size="sm" /> : <Refresh className="w-6" />}
          </button>
        </Tooltip>
      </motion.div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(activeAccount).map(
          ([network, { address, balance }], index) => (
            <motion.div
              key={network}
              {...fadeUpAnimation({ delay: (index + 1) * 0.1 })}
              className="w-full relative"
            >
              <NetworkCard
                network={network as TNetwork}
                address={address}
                balance={balance}
                networkMode={networkMode}
              />
            </motion.div>
          )
        )}
      </div>

      <Tabs
        tabs={TABS}
        delay={{
          header: lastNetworkCardDelay + 0.1,
          content: lastNetworkCardDelay + 0.2,
        }}
      />
    </div>
  );
};

export default DashboardPage;
