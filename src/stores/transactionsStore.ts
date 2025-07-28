import { create } from "zustand";
import { NETWORKS } from "@/config";
import type { Transaction, Network, Transactions } from "@/types";

interface TransactionsState {
  transactions: Transactions;
}

interface TransactionsActions {
  clearTransactions: () => void;
  setTransactions: (transactions: Transactions) => void;
  addTransaction: (network: Network, transaction: Transaction) => void;
}

interface TransactionsStore extends TransactionsState {
  actions: TransactionsActions;
}

const initialTransactions = Object.keys(NETWORKS).reduce((acc, network) => {
  acc[network as Network] = [];
  return acc;
}, {} as Transactions);

/**
 * Transactions store for managing transaction history across all networks in the active account.
 * Handles transaction caching, updates, and network-specific organization.
 */
const useTransactionsStore = create<TransactionsStore>((set) => ({
  transactions: initialTransactions,

  actions: {
    clearTransactions: () => set({ transactions: initialTransactions }),

    setTransactions: (transactions: Transactions) => set({ transactions }),

    addTransaction: (network: Network, transaction: Transaction) =>
      set((state) => ({
        transactions: {
          ...state.transactions,
          [network]: [transaction, ...state.transactions[network]],
        },
      })),
  },
}));

export const useTransactions = () =>
  useTransactionsStore((state) => state.transactions);

export const useTransactionActions = () =>
  useTransactionsStore((state) => state.actions);

export const getTransactionsState = () => useTransactionsStore.getState();
