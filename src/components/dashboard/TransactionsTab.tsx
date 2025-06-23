"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { NETWORKS, NETWORK_FUNCTIONS } from "@/config";
import { DEFAULT_NETWORK } from "@/constants";
import { TNetwork } from "@/types";
import {
  useAccountsStore,
  useTransactionsStore,
  useWalletStore,
} from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import getShortAddress from "@/utils/getShortAddress";
import parseTimestamp from "@/utils/parseTimestamp";
import { useClipboard } from "@/hooks";
import { Tooltip, CopyToggle } from "../ui";
import { Eye } from "../ui/icons";

const TransactionsTab = () => {
  const transactions = useTransactionsStore((state) => state.transactions);
  const activeAccount = useAccountsStore((state) => state.getActiveAccount());
  const networkMode = useWalletStore((state) => state.networkMode);

  const copyToClipboard = useClipboard();

  const [network, setNetwork] = useState<TNetwork>(DEFAULT_NETWORK);
  const [copiedText, setCopiedText] = useState<string>("");

  const networkTransactions = transactions[network];
  const networkConfig = NETWORKS[network];
  const networkGetExplorerUrl = NETWORK_FUNCTIONS[network].getExplorerUrl;

  const handleCopy = (text: string) => {
    copyToClipboard(text, copiedText === text, (copied) => {
      setCopiedText(copied ? text : "");
    });
  };

  return (
    <div className="w-full relative flex flex-col items-center gap-4">
      <motion.div
        className="w-full relative flex items-center gap-3"
        {...fadeUpAnimation()}
      >
        {Object.values(NETWORKS).map(({ id, name }) => (
          <button
            key={id}
            type="button"
            disabled={id === network}
            className={cn(
              "flex items-center gap-2 leading-none py-2.5 px-3 rounded-xl transition-all duration-300 font-medium border",
              id === network
                ? "bg-teal-500/10 border-teal-500/30 dark:border-teal-500/10 text-teal-500 pointer-events-none"
                : "bg-primary heading-color hover:bg-secondary border-color hover:border-focus"
            )}
            onClick={() => {
              if (id === network) return;
              setNetwork(id as TNetwork);
            }}
          >
            {name}
          </button>
        ))}
      </motion.div>

      <motion.div
        className="w-full relative border-1.5 border-color rounded-2xl overflow scrollbar-thin"
        {...fadeUpAnimation({ delay: 0.1 })}
      >
        <table className="w-full relative text-sm text-left">
          <thead className="w-full relative bg-primary">
            <tr className="w-full relative h-12">
              {[
                "",
                networkConfig.txnSignatureLabel,
                "Block",
                "Date Time",
                "Type",
                "From/To",
                "Amount",
                "Txn Fee",
              ].map((header) => (
                <th className="px-4 heading-color capitalize font-semibold whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="w-full relative">
            {networkTransactions.map((txn) => (
              <tr
                key={txn.signature}
                className="w-full h-12 relative border-t border-color hover:bg-primary"
              >
                <td className="px-4 whitespace-nowrap">
                  <Link
                    href={networkGetExplorerUrl(
                      "tx",
                      networkMode,
                      txn.signature
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-btn-bg-sm border border-color hover:border-focus"
                  >
                    <Eye className="w-4" />
                  </Link>
                </td>
                <td className="px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Tooltip content={txn.signature}>
                      <Link
                        href={networkGetExplorerUrl(
                          "tx",
                          networkMode,
                          txn.signature
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-500 truncate max-w-40"
                      >
                        {txn.signature}
                      </Link>
                    </Tooltip>
                    <CopyToggle
                      hasCopied={copiedText === txn.signature}
                      onClick={() => handleCopy(txn.signature)}
                      iconProps={{ className: "w-3.5 flex-shrink-0" }}
                    />
                  </div>
                </td>
                <td className="px-4 whitespace-nowrap">
                  <Link
                    href={networkGetExplorerUrl(
                      "block",
                      networkMode,
                      txn.block
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-500 truncate max-w-40"
                  >
                    {txn.block}
                  </Link>
                </td>
                <td className="px-4 whitespace-nowrap">
                  <span>{parseTimestamp(txn.timestamp)}</span>
                </td>
                <td className="px-4 whitespace-nowrap">
                  <span
                    className={cn(
                      "px-2.5 py-1.5 inline-block text-xs font-semibold rounded-lg uppercase tracking-wide",
                      {
                        "bg-teal-500/10 text-teal-500 border border-teal-500/20":
                          txn.type === "in",
                        "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20":
                          txn.type === "out",
                        "bg-secondary text-color border border-color":
                          txn.type === "self",
                      }
                    )}
                  >
                    {txn.type}
                  </span>
                </td>
                <td className="px-4 whitespace-nowrap">
                  {txn.type !== "self" ? (
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-muted-foreground text-xs whitespace-nowrap">
                        {txn.type === "in" ? "From" : "To"}
                      </span>
                      <Tooltip content={txn.type === "in" ? txn.from : txn.to}>
                        <Link
                          href={networkGetExplorerUrl(
                            "address",
                            networkMode,
                            txn.type === "in" ? txn.from : txn.to
                          )}
                          className="truncate underline hover:no-underline text-color font-mono text-xs max-w-[140px]"
                        >
                          {getShortAddress(
                            txn.type === "in" ? txn.from : txn.to
                          )}
                        </Link>
                      </Tooltip>
                      <CopyToggle
                        hasCopied={
                          copiedText === (txn.type === "in" ? txn.from : txn.to)
                        }
                        onClick={() =>
                          handleCopy(txn.type === "in" ? txn.from : txn.to)
                        }
                        iconProps={{ className: "w-3.5 flex-shrink-0" }}
                      />
                    </div>
                  ) : (
                    <span className="text-color font-medium">Self</span>
                  )}
                </td>
                <td className="px-4 whitespace-nowrap">
                  <span className="text-teal-500 font-semibold">
                    {txn.amount} {networkConfig.token}
                  </span>
                </td>
                <td className="px-4 whitespace-nowrap">
                  <span className="text-muted-foreground text-xs">
                    {txn.fee} {networkConfig.token}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default TransactionsTab;
