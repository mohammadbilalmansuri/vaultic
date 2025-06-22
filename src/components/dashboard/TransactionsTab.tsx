import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { NETWORKS, NETWORK_FUNCTIONS } from "@/config";
import { DEFAULT_NETWORK } from "@/constants";
import { TNetwork } from "@/types";
import {
  useAccountsStore,
  useTransactionsStore,
  useWalletStore,
} from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import { Button, Select } from "../ui";
import { Send } from "../ui/icons";
import cn from "@/utils/cn";

const TransactionsTab = () => {
  const transactions = useTransactionsStore((state) => state.transactions);
  const activeAccount = useAccountsStore((state) => state.getActiveAccount());
  const networkMode = useWalletStore((state) => state.networkMode);

  const [network, setNetwork] = useState<TNetwork>(DEFAULT_NETWORK);
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("latest-to-oldest");

  const networkOptions = Object.values(NETWORKS).map(({ id, name }) => ({
    label: name,
    value: id as TNetwork,
  }));

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Sent", value: "sent" },
    { label: "Received", value: "received" },
    { label: "Success", value: "success" },
    { label: "Failed", value: "failed" },
  ];

  const sortByOptions = [
    { label: "Latest to Oldest", value: "latest-to-oldest" },
    { label: "Oldest to Latest", value: "oldest-to-latest" },
    { label: "Amount High to Low", value: "amount-high-to-low" },
    { label: "Amount Low to High", value: "amount-low-to-high" },
  ];

  const networkTransactions = transactions[network];

  return (
    <div className="w-full relative flex flex-col items-center gap-4">
      <div className="w-full grid grid-cols-3 gap-4">
        <Select
          options={networkOptions}
          value={network}
          onChange={(value: TNetwork) => {
            if (value === network) return;
            setNetwork(value);
          }}
        />
        <Select
          options={filterOptions}
          value={filter}
          onChange={(value: string) => {
            if (value === filter) return;
            setFilter(value);
          }}
        />
        <Select
          options={sortByOptions}
          value={sortBy}
          onChange={(value: string) => {
            if (value === sortBy) return;
            setSortBy(value);
          }}
        />
      </div>

      <div className="w-full relative flex flex-col items-center gap-4">
        <AnimatePresence>
          {networkTransactions.length > 0 ? (
            networkTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.signature}
                className="w-full relative flex flex-col gap-2 p-4 border-1.5 border-color rounded-2xl"
                {...fadeUpAnimation({ delay: index * 0.1 })}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "size-10 flex items-center justify-center rounded-xl",
                        transaction.type === "send"
                          ? "bg-red-100 text-teal-500"
                          : "bg-teal-500/15 text-teal-500"
                      )}
                    >
                      <Send
                        className={cn("w-6", {
                          "rotate-180": transaction.type === "receive",
                        })}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {transaction.type === "send" ? "Sent" : "Received"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span
                      className={`text-sm font-semibold ${
                        transaction.type === "send"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {transaction.type === "send" ? "-" : "+"}
                      {transaction.amount} {NETWORKS[network].token || "TOKEN"}
                    </span>
                    <span className="text-xs text-gray-500">
                      Fee: {transaction.fee}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex flex-col gap-1">
                    <span>
                      From: {transaction.from.slice(0, 6)}...
                      {transaction.from.slice(-4)}
                    </span>
                    <span>
                      To: {transaction.to.slice(0, 6)}...
                      {transaction.to.slice(-4)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div>Block: {transaction.block}</div>
                    <div
                      className="truncate max-w-32"
                      title={transaction.signature}
                    >
                      {transaction.signature.slice(0, 8)}...
                      {transaction.signature.slice(-8)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.p className="text-center" {...fadeUpAnimation()}>
              No transactions available for this network.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-3/5 relative flex flex-col items-center text-center gap-6 my-4">
        <p>
          If your network address has more transactions or you want full details
          on a specific transaction, you can view them on the blockchain
          explorer.
        </p>
        <Button
          as="link"
          href={NETWORK_FUNCTIONS[network].getExplorerUrl(
            "address",
            networkMode,
            activeAccount[network].address
          )}
          target="_blank"
          rel="noopener noreferrer"
          variant="zinc"
        >
          View on {networkMode === "testnet" ? "Testnet" : ""} Explorer
        </Button>
      </div>
    </div>
  );
};

export default TransactionsTab;
