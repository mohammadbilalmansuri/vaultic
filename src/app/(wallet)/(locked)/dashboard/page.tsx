"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useWalletStore, useAccountsStore } from "@/stores";
import useActivityStore from "@/stores/activityStore";
import { Button, Loader, Tooltip } from "@/components/ui";
import { Send, QR, Clock, Refresh, Wallet } from "@/components/ui/icons";
import { NetworkCard } from "@/components/wallet";
import { SendTab, ReceiveTab, ActivityTab } from "@/components/wallet";
import { TNetwork, TIcon } from "@/types";
import cn from "@/utils/cn";
import { fadeUpAnimation } from "@/utils/animations";

type TTabLabel = "Send" | "Receive" | "Activity";

const TABS: {
  label: TTabLabel;
  icon: TIcon;
}[] = [
  { label: "Send", icon: Send },
  { label: "Receive", icon: QR },
  { label: "Activity", icon: Clock },
];

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<TTabLabel>("Send");
  const networkMode = useWalletStore((s) => s.networkMode);
  const activeAccountIndex = useAccountsStore((s) => s.activeAccountIndex);
  const activeAccount = useAccountsStore((s) => s.getActiveAccount());
  const activities = useActivityStore((s: any) => s.activities);

  return (
    <div className="w-full max-w-screen-lg relative flex flex-col gap-8 flex-1">
      {/* Header Section */}
      <motion.div
        className="w-full relative flex items-center justify-between gap-4"
        {...fadeUpAnimation()}
      >
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-full bg-teal-500/10 flex items-center justify-center">
            <Wallet className="w-6 text-teal-500" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold heading-color">
              Account {activeAccountIndex + 1} Dashboard
            </h2>
            <p>Manage your active account assets</p>
            {/* <p>Manage your wallet assets</p> */}
          </div>
        </div>

        <Tooltip content="Refresh Balances & Activities" position="bottom">
          <Button
            variant="zinc"
            // onClick={handleRefreshBalances}
            // disabled={refreshing}
          >
            {true ? <Loader size="sm" /> : <Refresh className="w-4" />}
            Refresh
          </Button>
        </Tooltip>
      </motion.div>

      {/* Network Cards Section */}
      <motion.div
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
        {...fadeUpAnimation({ delay: 0.1 })}
      >
        {(["ethereum", "solana"] as TNetwork[]).map((network) => {
          const networkAccount = activeAccount[network];
          return (
            <NetworkCard
              key={network}
              network={network}
              address={networkAccount.address}
              balance={networkAccount.balance}
              networkMode={networkMode}
            />
          );
        })}
      </motion.div>

      {/* Tabs Section */}
      <motion.div
        className="w-full relative flex flex-col gap-6"
        {...fadeUpAnimation({ delay: 0.2 })}
      >
        {/* Tab Buttons */}
        <div className="w-full relative grid grid-cols-3 bg-primary rounded-2xl p-1 h-14">
          <motion.div
            className="absolute bg-secondary rounded-xl h-[calc(100%-8px)] top-1"
            style={{
              left: `calc(${["send", "receive", "activity"].indexOf(
                activeTab
              )} * 33.333% + 4px)`,
              width: "calc(33.333% - 8px)",
            }}
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          {TABS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={cn(
                "font-medium px-5 leading-none transition-all duration-300 relative z-10 flex items-center justify-center gap-2",
                {
                  "heading-color": activeTab === label,
                  "hover:heading-color": activeTab !== label,
                }
              )}
              onClick={() => setActiveTab(label)}
            >
              <Icon className="w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === "Send" && <SendTab activeAccount={activeAccount} />}

            {activeTab === "Receive" && (
              <ReceiveTab activeAccount={activeAccount} />
            )}

            {activeTab === "Activity" && <ActivityTab />}
          </motion.div>{" "}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
