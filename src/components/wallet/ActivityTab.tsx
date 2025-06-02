"use client";
import { Button, Loader } from "@/components/ui";
import {
  Clock,
  Send,
  QR,
  Ethereum,
  Solana,
  WalletMoney,
} from "@/components/ui/icons";
import useActivityStore from "@/stores/activityStore";
import { TNetwork, IActivity } from "@/types";
import cn from "@/utils/cn";
import getShortAddress from "@/utils/getShortAddress";
import { useState } from "react";

const ActivityTab = () => {
  const activities = useActivityStore((s) => s.activities);
  const getNetworkIcon = (network: string) => {
    switch (network) {
      case "ethereum":
        return Ethereum;
      case "solana":
        return Solana;
      default:
        return WalletMoney;
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  const getRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getExplorerLink = (network: TNetwork, txHash: string) => {
    if (network === "ethereum") {
      return `https://etherscan.io/tx/${txHash}`;
    } else if (network === "solana") {
      return `https://solscan.io/tx/${txHash}`;
    }
    return "#";
  };

  const getAddressExplorerLink = (network: TNetwork, address: string) => {
    if (network === "ethereum") {
      return `https://etherscan.io/address/${address}`;
    } else if (network === "solana") {
      return `https://solscan.io/account/${address}`;
    }
    return "#";
  };

  // Get sample addresses for explorer links
  const ethereumAddress =
    activities.find((a) => a.network === "ethereum")?.from ||
    activities.find((a) => a.network === "ethereum")?.to ||
    "";
  const solanaAddress =
    activities.find((a) => a.network === "solana")?.from ||
    activities.find((a) => a.network === "solana")?.to ||
    "";

  // Format amount with commas and up to 6 decimals
  const formatAmount = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  // Filter and sort state
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "amount-high" | "amount-low"
  >("newest");
  const [filterType, setFilterType] = useState<"all" | "send" | "receive">(
    "all"
  );
  const [filterStatus, setFilterStatus] = useState<
    "all" | "success" | "failed"
  >("all");

  // Filter and sort logic
  let filtered = activities;
  if (filterType !== "all")
    filtered = filtered.filter((a) => a.type === filterType);
  if (filterStatus !== "all")
    filtered = filtered.filter((a) => a.status === filterStatus);
  if (sortBy === "newest")
    filtered = filtered.slice().sort((a, b) => b.timestamp - a.timestamp);
  if (sortBy === "oldest")
    filtered = filtered.slice().sort((a, b) => a.timestamp - b.timestamp);
  if (sortBy === "amount-high")
    filtered = filtered
      .slice()
      .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
  if (sortBy === "amount-low")
    filtered = filtered
      .slice()
      .sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));

  return (
    <div className="w-full">
      <div className="border border-color rounded-3xl p-0 bg-gradient-to-br from-primary/40 to-secondary/30 shadow-2xl overflow-hidden">
        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap gap-3 px-6 pt-6 pb-2 items-center justify-between bg-primary/60 border-b border-color/60">
          <div className="flex gap-2 flex-wrap">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input px-3 py-2 rounded-xl border border-color bg-white/80 text-base font-medium focus:ring-2 focus:ring-teal-400 transition"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="amount-high">Amount High-Low</option>
              <option value="amount-low">Amount Low-High</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="input px-3 py-2 rounded-xl border border-color bg-white/80 text-base font-medium focus:ring-2 focus:ring-teal-400 transition"
            >
              <option value="all">All Types</option>
              <option value="send">Send</option>
              <option value="receive">Receive</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="input px-3 py-2 rounded-xl border border-color bg-white/80 text-base font-medium focus:ring-2 focus:ring-teal-400 transition"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
            <Button
              size="sm"
              variant="zinc"
              className="rounded-xl px-4 py-2 font-semibold border border-color bg-white/80 hover:bg-teal-500/10 transition"
              onClick={() => {
                setSortBy("newest");
                setFilterType("all");
                setFilterStatus("all");
              }}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Explorer Links */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 pt-4 pb-2">
          <div className="flex flex-wrap gap-3">
            <a
              href={getAddressExplorerLink("ethereum", ethereumAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-color text-color hover:border-teal-500/50 hover:text-teal-500 transition-all bg-white/90 shadow-sm font-semibold"
            >
              <Ethereum className="w-4" />
              <span className="text-sm">Ethereum Explorer</span>
            </a>
            <a
              href={getAddressExplorerLink("solana", solanaAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-color text-color hover:border-teal-500/50 hover:text-teal-500 transition-all bg-white/90 shadow-sm font-semibold"
            >
              <Solana className="w-4" />
              <span className="text-sm">Solana Explorer</span>
            </a>
          </div>
        </div>

        {/* Activity List */}
        <div className="px-2 md:px-6 pb-6">
          {false ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <Loader />
                <p className="text-color text-lg font-medium">
                  Loading activity...
                </p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Clock className="w-16 h-16 text-color mx-auto mb-4 opacity-50" />
              <p className="text-xl heading-color mb-2 font-semibold">
                No transactions found
              </p>
              <p className="text-color text-base">
                Your transaction activity will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin">
              {filtered.map((activity: IActivity) => {
                const Icon = getNetworkIcon(activity.network);
                const isOutgoing = activity.type === "send";
                const statusBadge =
                  activity.status === "success" ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-teal-100 text-teal-700 border border-teal-200 font-semibold">
                      <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                      Success
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-200 font-semibold">
                      <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                      Failed
                    </span>
                  );

                return (
                  <div
                    key={activity.signature}
                    className={cn(
                      "flex flex-col md:flex-row md:items-center gap-4 p-5 border border-color rounded-2xl bg-white/95 hover:bg-primary/30 transition-colors shadow group focus-within:ring-2 focus-within:ring-teal-400"
                    )}
                    tabIndex={0}
                    aria-label={`Transaction ${activity.signature}`}
                  >
                    <div className="flex-shrink-0 flex items-center gap-3">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-200 group-hover:scale-105",
                          isOutgoing
                            ? "bg-rose-500/20 text-rose-500"
                            : "bg-teal-500/20 text-teal-500"
                        )}
                      >
                        {isOutgoing ? (
                          <Send className="w-5" />
                        ) : (
                          <QR className="w-5" />
                        )}
                      </div>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold heading-color capitalize text-base">
                          {activity.type}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-secondary border">
                          {activity.network.toUpperCase()}
                        </span>
                        {statusBadge}
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-color">
                          {isOutgoing ? "To: " : "From: "}
                          <button
                            // onClick={() =>
                            //   onCopyAddress(
                            //     isOutgoing ? activity.to : activity.from,
                            //     activity.network as TNetwork
                            //   )
                            // }
                            className="font-mono hover:heading-color transition-colors underline underline-offset-2 focus:outline-none"
                            aria-label={`Copy ${
                              isOutgoing ? "recipient" : "sender"
                            } address`}
                          >
                            {getShortAddress(
                              isOutgoing ? activity.to : activity.from,
                              activity.network as TNetwork
                            )}
                          </button>
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-color">
                          <span>{formatTimestamp(activity.timestamp)}</span>
                          <span>•</span>
                          <span>{getRelativeTime(activity.timestamp)}</span>
                          <span>•</span>
                          <a
                            href={getExplorerLink(
                              activity.network as TNetwork,
                              activity.signature
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-teal-500 transition-colors underline underline-offset-2"
                            aria-label="View transaction on explorer"
                          >
                            View on Explorer
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="text-right min-w-[120px]">
                      <p
                        className={cn(
                          "font-semibold text-lg",
                          isOutgoing ? "text-rose-500" : "text-teal-500"
                        )}
                      >
                        {isOutgoing ? "-" : "+"}
                        {formatAmount(activity.amount)}{" "}
                        {activity.network === "ethereum" ? "ETH" : "SOL"}
                      </p>
                      <button
                        // onClick={() =>
                        //   onCopyAddress(
                        //     activity.signature,
                        //     activity.network as TNetwork
                        //   )
                        // }
                        className="text-xs text-color hover:heading-color transition-colors mt-1 underline underline-offset-2 focus:outline-none"
                        aria-label="Copy transaction hash"
                      >
                        Copy TX
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Results Summary */}
        {/* {!loadingHistory && filtered.length > 0 && (
          <div className="mt-4 pt-4 border-t border-color bg-primary/10 px-6">
            <p className="text-sm text-color text-center font-medium">
              Showing {filtered.length} transactions
            </p>
          </div>
        )} */}

        {/* View More Links */}
        {filtered.length > 20 && (
          <div className="mt-6 flex flex-col gap-2 items-center px-6 pb-6">
            <a
              href="https://etherscan.io/address/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-500 underline text-sm font-medium"
            >
              View more on Ethereum Explorer
            </a>
            <a
              href="https://solscan.io/account/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-500 underline text-sm font-medium"
            >
              View more on Solana Explorer
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTab;
