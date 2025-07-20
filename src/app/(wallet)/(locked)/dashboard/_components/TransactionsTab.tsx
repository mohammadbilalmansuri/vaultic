"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { NETWORKS, NETWORK_FUNCTIONS } from "@/config";
import { DEFAULT_NETWORK } from "@/constants";
import type { Network } from "@/types";
import {
  useAccountsStore,
  useNotificationStore,
  useTransactionsStore,
  useWalletStore,
} from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import getShortAddress from "@/utils/getShortAddress";
import parseBalance from "@/utils/parseBalance";
import parseTimestamp from "@/utils/parseTimestamp";
import { useBlockchain, useClipboard, useMounted } from "@/hooks";
import { ListCross, ExternalLink, Refresh } from "@/components/icons";
import { Tooltip, CopyToggle, Button, Loader } from "@/components/ui";

const TransactionsTab = () => {
  const transactions = useTransactionsStore((state) => state.transactions);
  const activeAccount = useAccountsStore((state) => state.getActiveAccount());
  const networkMode = useWalletStore((state) => state.networkMode);

  const copyToClipboard = useClipboard();
  const { fetchActiveAccountTransactions } = useBlockchain();
  const notify = useNotificationStore((state) => state.notify);

  const [network, setNetwork] = useState<Network>(DEFAULT_NETWORK);
  const [copiedItems, setCopiedItems] = useState("");
  const [refreshing, startRefreshing] = useTransition();

  const networkTransactions = transactions[network];
  const networkConfig = NETWORKS[network];
  const networkGetExplorerUrl = NETWORK_FUNCTIONS[network].getExplorerUrl;

  const handleRefresh = () => {
    startRefreshing(async () => {
      try {
        await fetchActiveAccountTransactions();
        notify({
          type: "success",
          message: "Transactions refreshed successfully!",
        });
      } catch {
        notify({
          type: "error",
          message: "Failed to refresh transactions",
        });
      }
    });
  };

  const handleNetworkChange = (newNetwork: Network) => {
    if (newNetwork === network) return;
    setNetwork(newNetwork);
    setCopiedItems("");
  };

  const handleCopy = (text: string, id?: string) => {
    const uniqueText = id ? `${text}-${id}` : text;
    copyToClipboard(text, copiedItems === uniqueText, (copied) =>
      setCopiedItems(copied ? uniqueText : "")
    );
  };

  const hasTabMounted = useMounted(1000);

  return (
    <div className="w-full relative flex flex-col items-center gap-3">
      <motion.div
        className="w-full relative flex items-center justify-between gap-3"
        {...fadeUpAnimation()}
      >
        <div className="flex items-center gap-3">
          {Object.values(NETWORKS).map(({ id, name }) => (
            <button
              key={`${id}-button`}
              type="button"
              disabled={id === network}
              onClick={() => handleNetworkChange(id as Network)}
              className={cn(
                "flex items-center gap-2 leading-none py-2.5 px-3 rounded-xl transition-all duration-200 font-medium border",
                id === network
                  ? "bg-teal-500/10 border-teal-500/30 dark:border-teal-500/10 text-teal-500 pointer-events-none"
                  : "bg-primary text-primary hover:bg-secondary hover:border-focus"
              )}
            >
              {name}
            </button>
          ))}
        </div>

        <Tooltip
          content={refreshing ? "Refreshing..." : "Refresh Transactions"}
          position="left"
        >
          <button
            className={cn("icon-btn-bg", {
              "cursor-default bg-secondary": refreshing,
            })}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? <Loader size="sm" /> : <Refresh />}
          </button>
        </Tooltip>
      </motion.div>

      <motion.div
        className="w-full relative border-1.5 rounded-2xl overflow-hidden"
        key={`transactions-table-${network}`}
        {...fadeUpAnimation({ delay: !hasTabMounted ? 0.1 : undefined })}
      >
        <div className="w-full relative overflow-x-auto">
          <table className="w-full relative text-sm text-left">
            <thead>
              <tr className="h-12">
                {[
                  networkConfig.txnSignatureLabel,
                  "Block",
                  "Date Time (UTC)",
                  "Type",
                  "From/To",
                  "Amount",
                  `Fee (${networkConfig.token})`,
                ].map((header) => (
                  <th
                    key={`${network}-${header}`}
                    className="px-4 text-primary font-semibold whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {networkTransactions.length > 0 ? (
                networkTransactions.map((txn) => {
                  const { utc, age } = parseTimestamp(txn.timestamp);
                  const addressToShow = txn.type === "in" ? txn.from : txn.to;
                  const addressWithId = `${addressToShow}-${txn.signature}`;

                  return (
                    <tr
                      key={`${txn.network}-${txn.signature}`}
                      className="h-12 border-t-1.5 hover:bg-primary transition-all duration-200"
                    >
                      {/* Txn Signature */}
                      <td className="px-4 whitespace-nowrap">
                        <div className="flex items-center gap-px">
                          <Tooltip content="View Txn On Explorer">
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
                          <Tooltip
                            content={
                              copiedItems === txn.signature
                                ? "Copied!"
                                : `Copy Txn ${networkConfig.txnSignatureLabel}`
                            }
                          >
                            <CopyToggle
                              hasCopied={copiedItems === txn.signature}
                              onClick={() => handleCopy(txn.signature)}
                              iconProps={{ className: "w-4" }}
                            />
                          </Tooltip>
                        </div>
                      </td>

                      {/* Block Number */}
                      <td className="px-4 whitespace-nowrap">
                        <Link
                          href={networkGetExplorerUrl(
                            "block",
                            networkMode,
                            txn.block
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-500"
                        >
                          {txn.block}
                        </Link>
                      </td>

                      {/* Timestamp */}
                      <td className="px-4 whitespace-nowrap">
                        <Tooltip content={age}>
                          <span className="cursor-default">{utc}</span>
                        </Tooltip>
                      </td>

                      {/* Type */}
                      <td className="px-4 whitespace-nowrap">
                        <span
                          className={cn(
                            "w-11 h-6.5 pt-px flex items-center justify-center text-xs font-semibold rounded-lg uppercase tracking-wide border select-none",
                            {
                              "highlight-teal": txn.type === "in",
                              "highlight-yellow": txn.type === "out",
                              "highlight-zinc": txn.type === "self",
                            }
                          )}
                        >
                          {txn.type}
                        </span>
                      </td>

                      {/* From/To Address */}
                      <td className="px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {txn.type !== "self" && (
                            <span>{txn.type === "in" ? "From" : "To"}</span>
                          )}
                          <Tooltip content={addressToShow}>
                            <Link
                              href={networkGetExplorerUrl(
                                "address",
                                networkMode,
                                addressToShow
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-500"
                            >
                              {getShortAddress(addressToShow, txn.network)}
                            </Link>
                          </Tooltip>
                          <Tooltip
                            content={
                              copiedItems === addressWithId
                                ? "Copied!"
                                : "Copy Address"
                            }
                          >
                            <CopyToggle
                              hasCopied={copiedItems === addressWithId}
                              onClick={() =>
                                handleCopy(addressToShow, txn.signature)
                              }
                              iconProps={{ className: "w-4" }}
                            />
                          </Tooltip>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-4 whitespace-nowrap text-primary">
                        {`${parseBalance(txn.amount).original} ${
                          networkConfig.token
                        }`}
                      </td>

                      {/* Fee */}
                      <td className="px-4 whitespace-nowrap text-[13px]">
                        {txn.fee}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="h-60 border-t-1.5">
                  <td colSpan={7} className="px-4 size-full">
                    <div className="size-full flex flex-col items-center justify-center gap-2 text-center">
                      <ListCross className="icon-lg text-yellow-500" />
                      <p className="text-md max-w-60">
                        No transactions found for this {network} address.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {networkTransactions.length === 10 && (
        <motion.div
          className="w-full max-w-2xl flex flex-col items-center gap-5 py-4 text-center"
          key={`explorer-section-${network}`}
          {...fadeUpAnimation({ delay: !hasTabMounted ? 0.2 : 0.1 })}
        >
          <p>
            Showing your 10 most recent transactions. For your complete
            transaction history and detailed analytics, explore your address on
            the {networkConfig.name}
            {networkMode === "testnet" ? ` ${networkConfig.testnetName} ` : " "}
            explorer.
          </p>

          <Button
            as="link"
            href={networkGetExplorerUrl(
              "address",
              networkMode,
              activeAccount[network].address
            )}
            target="_blank"
            rel="noopener noreferrer"
            variant="zinc"
          >
            <ExternalLink className="w-4.5" />
            <span>View Complete History</span>
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default TransactionsTab;
