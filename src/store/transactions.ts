"use client";

import { create } from "zustand";
import { setItem, getItem } from "@/utils/indexedDB";

interface Transaction {
  txHash: string;
  walletId: string;
  from: string;
  to: string;
  value: number;
  timestamp: number;
  status: "pending" | "success" | "failed";
  blockchain: "solana" | "ethereum";
}

interface TransactionState {
  transactions: Transaction[];
  loadTransactions: (walletId: string) => Promise<void>;
  addTransaction: (transaction: Transaction) => Promise<void>;
  clearTransactions: (walletId: string) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],

  // ✅ Load transactions from IndexedDB (filtered by walletId)
  loadTransactions: async (walletId) => {
    const allTransactions =
      (await getItem<Transaction[]>("transactions")) || [];
    const filteredTransactions = allTransactions.filter(
      (tx) => tx.walletId === walletId
    );
    set({ transactions: filteredTransactions });
  },

  // ✅ Add a new transaction
  addTransaction: async (transaction) => {
    console.log("Adding transaction:", transaction);

    const existingTransactions =
      (await getItem<Transaction[]>("transactions")) || [];
    const updatedTransactions = [...existingTransactions, transaction];

    await setItem("transactions", updatedTransactions);
    set({ transactions: updatedTransactions });
  },

  // ✅ Clear transactions for a specific wallet (e.g., when user removes wallet)
  clearTransactions: async (walletId) => {
    console.log("Clearing transactions for wallet:", walletId);

    const existingTransactions =
      (await getItem<Transaction[]>("transactions")) || [];
    const updatedTransactions = existingTransactions.filter(
      (tx) => tx.walletId !== walletId
    );

    await setItem("transactions", updatedTransactions);
    set({ transactions: updatedTransactions });
  },
}));
