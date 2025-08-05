"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { NETWORKS, NETWORK_FUNCTIONS } from "@/config";
import { DEFAULT_NETWORK } from "@/constants";
import type { Network } from "@/types";
import {
  useActiveAccount,
  useCopiedId,
  useCopyToClipboard,
  useNetworkMode,
  useNotificationActions,
  useTransactions,
} from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import getShortAddress from "@/utils/get-short-address";
import parseBalance from "@/utils/parse-balance";
import parseTimestamp from "@/utils/parse-timestamp";
import { useBlockchain } from "@/hooks";
import { ListCross, ExternalLink, Refresh } from "@/components/icons";
import { Tooltip, CopyToggle, Button, Loader } from "@/components/ui";

const TransactionsTabPanel = () => {
  const transactions = useTransactions();
  const activeAccount = useActiveAccount();
  const networkMode = useNetworkMode();
  const copiedId = useCopiedId();
  const copyToClipboard = useCopyToClipboard();
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

  return (
    <div className="w-full relative flex flex-col items-center gap-4">
      <motion.div
        className="w-full relative flex items-center justify-between gap-4"
        {...fadeUpAnimation()}
      >
        <div
          className="flex items-center sm:gap-3 gap-2"
          role="tablist"
          aria-label="Network selection"
        >
          {Object.values(NETWORKS).map(({ id, name }) => (
            <button
              key={`${id}-button`}
              type="button"
              className={cn(
                "leading-none sm:h-10 h-9 sm:px-3 px-2.5 py-2 rounded-xl transition-colors duration-200 font-medium border",
                id === network
                  ? "highlight-teal pointer-events-none"
                  : "highlight-zinc hover:bg-secondary"
              )}
              onClick={() => setNetwork(id as Network)}
              disabled={id === network}
              role="tab"
              aria-selected={id === network}
              aria-controls={`transactions-panel-${id}`}
              aria-label={`View ${name} transactions`}
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
            type="button"
            className={cn("icon-btn-bg", {
              "bg-secondary pointer-events-none": refreshing,
            })}
            onClick={handleRefresh}
            disabled={refreshing}
            aria-label="Refresh transactions"
          >
            {refreshing ? <Loader size="sm" /> : <Refresh />}
          </button>
        </Tooltip>
      </motion.div>

      <motion.div
        className="w-full relative border-1.5 rounded-3xl overflow-hidden"
        key={`transactions-table-${network}`}
        id={`transactions-panel-${network}`}
        role="tabpanel"
        aria-labelledby={`${network}-button`}
        {...fadeUpAnimation()}
      >
        {networkTransactions.length > 0 ? (
          <div className="w-full relative overflow-x-auto">
            <table
              className="w-full relative text-sm text-left"
              role="table"
              aria-label={`${networkConfig.name} transactions`}
              aria-rowcount={networkTransactions.length + 1}
            >
              <thead>
                <tr className="h-12" role="row">
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
                      className="px-4 text-primary font-medium whitespace-nowrap"
                      role="columnheader"
                      scope="col"
                      aria-sort="none"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody role="rowgroup">
                {networkTransactions.map((txn, index) => {
                  const { utc, age } = parseTimestamp(txn.timestamp);
                  const addressToShow = txn.type === "in" ? txn.from : txn.to;
                  const signatureCopyId = `${network}-signature-${index}`;
                  const addressCopyId = `${network}-address-${index}`;

                  return (
                    <tr
                      key={`${txn.network}-${txn.signature}`}
                      className="h-12 border-t-1.5 hover:bg-primary transition-colors duration-200"
                      role="row"
                      aria-rowindex={index + 2}
                    >
                      {/* Txn Signature */}
                      <td className="px-4 whitespace-nowrap" role="gridcell">
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
                              aria-label={`View transaction "${txn.signature}" on explorer`}
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
                      <td className="px-4 whitespace-nowrap" role="gridcell">
                        <Link
                          href={networkGetExplorerUrl(
                            "block",
                            networkMode,
                            txn.block
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-500"
                          aria-label={`View block "${txn.block}" on explorer`}
                        >
                          {txn.block}
                        </Link>
                      </td>

                      {/* Timestamp */}
                      <td className="px-4 whitespace-nowrap" role="gridcell">
                        <Tooltip content={age} delay={0}>
                          <span className="cursor-default">{utc}</span>
                        </Tooltip>
                      </td>

                      {/* Type */}
                      <td className="px-4 whitespace-nowrap" role="gridcell">
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
                      <td className="px-4 whitespace-nowrap" role="gridcell">
                        <div className="flex items-center gap-1.5">
                          {txn.type !== "self" && (
                            <span>{txn.type === "in" ? "From" : "To"}</span>
                          )}
                          <Tooltip
                            content={addressToShow}
                            delay={0}
                            tooltipClassName="xs:w-auto w-40 xs:whitespace-nowrap whitespace-break-spaces xs:break-normal break-all"
                          >
                            <Link
                              href={networkGetExplorerUrl(
                                "address",
                                networkMode,
                                addressToShow
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-500"
                              aria-label={`View address "${addressToShow}" on explorer.`}
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
                      <td className="px-4 whitespace-nowrap" role="gridcell">
                        <span className="text-primary">
                          {`${parseBalance(txn.amount).original} ${
                            networkConfig.token
                          }`}
                        </span>
                      </td>

                      {/* Fee */}
                      <td className="px-4 whitespace-nowrap" role="gridcell">
                        <span className="text-[13px]">{txn.fee}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            className="h-60 p-4 w-full flex flex-col items-center justify-center gap-3 text-center"
            role="status"
            aria-live="polite"
          >
            <ListCross
              className="icon-lg text-yellow-500"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <p className="text-md max-w-60">
              No transactions found for this
              <span className="lowercase"> {networkConfig.name} </span>address.
            </p>
          </div>
        )}
      </motion.div>

      {networkTransactions.length === 10 && (
        <motion.div
          className="w-full max-w-2xl flex flex-col items-center gap-5 pt-2 pb-4 text-center"
          key={`explorer-section-${network}`}
          {...fadeUpAnimation()}
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
            aria-label={`View complete transaction history for ${networkConfig.name} address on explorer`}
          >
            <ExternalLink className="w-4.5" aria-hidden="true" />
            <span>View Complete History</span>
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default TransactionsTabPanel;
