"use client";
import { useState, useTransition } from "react";
import { motion } from "motion/react";
import { NETWORKS } from "@/config";
import type { Network, TabsData } from "@/types";
import {
  useWalletStore,
  useAccountsStore,
  useNotificationStore,
} from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import getShortAddress from "@/utils/getShortAddress";
import parseBalance from "@/utils/parseBalance";
import { useBlockchain, useClipboard } from "@/hooks";
import { Send, QR, Clock, Refresh } from "@/components/icons";
import { Tabs } from "@/components/shared";
import { Loader, Tooltip, NetworkLogo, CopyToggle } from "@/components/ui";
import SendTab from "./_components/SendTab";
import ReceiveTab from "./_components/ReceiveTab";
import TransactionsTab from "./_components/TransactionsTab";

const TABS: TabsData = [
  { label: "Send", icon: Send, panel: SendTab },
  { label: "Receive", icon: QR, panel: ReceiveTab },
  { label: "Transactions", icon: Clock, panel: TransactionsTab },
];

const DashboardPage = () => {
  const networkMode = useWalletStore((state) => state.networkMode);
  const activeAccountIndex = useAccountsStore(
    (state) => state.activeAccountIndex
  );
  const activeAccount = useAccountsStore((state) => state.getActiveAccount());
  const switchingToAccount = useAccountsStore(
    (state) => state.switchingToAccount
  );
  const notify = useNotificationStore((state) => state.notify);

  const { fetchActiveAccountBalances } = useBlockchain();
  const copyToClipboard = useClipboard();

  const [refreshing, startRefreshing] = useTransition();
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    copyToClipboard(text, copiedText === text, (copied) =>
      setCopiedText(copied ? text : null)
    );
  };

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
      <div className="flex flex-col items-center justify-center gap-8 text-center flex-1">
        <Loader />
        <p className="sm:text-lg">
          Switching to Account {switchingToAccount + 1}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-lg relative flex flex-col gap-6 flex-1">
      <motion.div
        className="w-full relative flex items-center justify-between gap-4"
        {...fadeUpAnimation()}
      >
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-500 flex items-center justify-center shrink-0 font-semibold uppercase text-xl">
            {`A${activeAccountIndex + 1}`}
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold heading-color">
              Account {activeAccountIndex + 1}
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
            className={cn("icon-btn-bg", {
              "bg-secondary pointer-events-none": refreshing,
            })}
            onClick={handleBalanceRefresh}
            disabled={refreshing}
          >
            {refreshing ? <Loader size="sm" /> : <Refresh />}
          </button>
        </Tooltip>
      </motion.div>

      <motion.div
        className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5"
        {...fadeUpAnimation({ delay: 0.05 })}
      >
        {Object.entries(activeAccount).map(
          ([networkKey, { address, balance }], index) => {
            const network = networkKey as Network;
            const networkConfig = NETWORKS[network];
            const parsedBalance = parseBalance(balance);
            const isCopied = copiedText === address;

            const networkDisplayName = `${networkConfig.name}${
              networkMode === "testnet" ? ` ${networkConfig.testnetName}` : ""
            }`;

            const balanceElement = (
              <p className="text-md font-semibold leading-none cursor-default">
                {parsedBalance.display} {networkConfig.token}
              </p>
            );

            return (
              <div
                key={`${network}-card`}
                className="w-full relative flex items-center justify-between rounded-3xl bg-primary px-5 py-6"
              >
                <div className="flex items-center gap-2.5">
                  <NetworkLogo network={network} size="md" />

                  <div className="flex flex-col items-start gap-1">
                    <h4 className="font-medium heading-color">
                      {networkDisplayName}
                    </h4>

                    <Tooltip
                      content={isCopied ? "Copied!" : "Copy Address"}
                      position="bottom"
                    >
                      <div
                        className="flex items-center gap-1.5 cursor-pointer hover:heading-color transition-all duration-200"
                        onClick={() => handleCopy(address)}
                      >
                        <p className="leading-none">
                          {getShortAddress(address, network)}
                        </p>
                        <CopyToggle
                          hasCopied={isCopied}
                          className="text-current"
                          iconProps={{ className: "w-4" }}
                        />
                      </div>
                    </Tooltip>
                  </div>
                </div>

                <Tooltip
                  content={
                    parsedBalance.wasRounded
                      ? `${parsedBalance.original} ${networkConfig.token}`
                      : undefined
                  }
                  position="left"
                >
                  {balanceElement}
                </Tooltip>
              </div>
            );
          }
        )}
      </motion.div>

      <Tabs
        tabs={TABS}
        delay={{ list: 0.1, panel: 0.15 }}
        buttonClassName="xxs:flex-row flex-col"
      />
    </div>
  );
};

export default DashboardPage;
