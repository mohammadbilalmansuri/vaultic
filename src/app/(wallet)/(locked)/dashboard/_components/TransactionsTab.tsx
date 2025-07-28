"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { NETWORKS, NETWORK_FUNCTIONS } from "@/config";
import { DEFAULT_NETWORK } from "@/constants";
import type { Network } from "@/types";
import {
  useAccountActions,
  useClipboardActions,
  useCopiedId,
  useNetworkMode,
  useNotificationActions,
  useTransactions,
} from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import getShortAddress from "@/utils/getShortAddress";
import parseBalance from "@/utils/parseBalance";
import parseTimestamp from "@/utils/parseTimestamp";
import { useBlockchain, useMounted } from "@/hooks";
import { ListCross, ExternalLink, Refresh } from "@/components/icons";
import { Tooltip, CopyToggle, Button, Loader } from "@/components/ui";

const TransactionsTab = () => {
  const transactions = useTransactions();
  const activeAccount = useAccountActions().getActiveAccount();
  const networkMode = useNetworkMode();
  const copiedId = useCopiedId();
  const { copyToClipboard } = useClipboardActions();
  const { notify } = useNotificationActions();

  const { fetchActiveAccountTransactions } = useBlockchain();
  const [refreshing, startRefreshing] = useTransition();

  const [network, setNetwork] = useState<Network>(DEFAULT_NETWORK);
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
                "leading-none py-2.5 px-3 rounded-lg transition-all duration-200 font-medium border",
                id === network
                  ? "highlight-teal pointer-events-none"
                  : "highlight-zinc hover:bg-secondary"
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
        {networkTransactions.length > 0 ? (
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
                {networkTransactions.map((txn, index) => {
                  const { utc, age } = parseTimestamp(txn.timestamp);
                  const addressToShow = txn.type === "in" ? txn.from : txn.to;
                  const signatureCopyId = `${network}-signature-${index}`;
                  const addressCopyId = `${network}-address-${index}`;

                  return (
                    <tr
                      key={`${txn.network}-${txn.signature}`}
                      className="h-12 border-t-1.5 hover:bg-primary transition-all duration-200"
                    >
                      {/* Txn Signature */}
                      <td className="px-4 whitespace-nowrap">
                        <div className="flex items-center gap-px">
                          <Tooltip content="View Txn On Explorer" delay={0}>
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
                              copiedId === signatureCopyId
                                ? "Copied!"
                                : `Copy Txn ${networkConfig.txnSignatureLabel}`
                            }
                          >
                            <CopyToggle
                              hasCopied={copiedId === signatureCopyId}
                              onClick={() =>
                                copyToClipboard(txn.signature, signatureCopyId)
                              }
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
                        <Tooltip content={age} delay={0}>
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
                          <Tooltip content={addressToShow} delay={0}>
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
                              copiedId === addressCopyId
                                ? "Copied!"
                                : "Copy Address"
                            }
                          >
                            <CopyToggle
                              hasCopied={copiedId === addressCopyId}
                              onClick={() =>
                                copyToClipboard(addressToShow, addressCopyId)
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
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-60 w-full flex items-center justify-center text-center gap-3">
            <ListCross className="icon-lg text-yellow-500" />
            <p className="text-md max-w-60">
              No transactions found for this {network} address.
            </p>
          </div>
        )}
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
