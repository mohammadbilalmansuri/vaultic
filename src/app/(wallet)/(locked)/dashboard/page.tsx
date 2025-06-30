"use client";
import { useState, useTransition } from "react";
import { motion } from "motion/react";
import { NETWORKS } from "@/config";
import { TNetwork, TTabs } from "@/types";
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
import { SendTab, ReceiveTab, TransactionsTab } from "@/components/dashboard";
import {
  Loader,
  Tooltip,
  Tabs,
  NetworkLogo,
  CopyToggle,
} from "@/components/ui";
import { Send, QR, Clock, Refresh, Wallet } from "@/components/ui/icons";

const TABS: TTabs = {
  Send: { icon: Send, content: SendTab },
  Receive: { icon: QR, content: ReceiveTab },
  Transactions: { icon: Clock, content: TransactionsTab },
} as const;

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

  const handleCopy = (text: string) => {
    copyToClipboard(text, copiedText === text, (copied) =>
      setCopiedText(copied ? text : null)
    );
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
    <div className="w-full max-w-screen-lg relative flex flex-col gap-6 flex-1">
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

        <Tooltip content={refreshing ? "Refreshing..." : "Refresh Balances"}>
          <button
            className={cn("icon-btn-bg", {
              "cursor-default bg-primary pointer-events-none": refreshing,
            })}
            onClick={handleBalanceRefresh}
            disabled={refreshing}
          >
            {refreshing ? <Loader size="sm" /> : <Refresh />}
          </button>
        </Tooltip>
      </motion.div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
        {Object.entries(activeAccount).map(
          ([networkKey, { address, balance }], index) => {
            const network = networkKey as TNetwork;
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
              <motion.div
                key={network}
                {...fadeUpAnimation({ delay: (index + 1) * 0.1 })}
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
                        className="flex items-center gap-1.5 cursor-pointer hover:heading-color transition-all duration-300"
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

                {parsedBalance.wasRounded ? (
                  <Tooltip
                    content={`${parsedBalance.original} ${networkConfig.token}`}
                  >
                    {balanceElement}
                  </Tooltip>
                ) : (
                  balanceElement
                )}
              </motion.div>
            );
          }
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
