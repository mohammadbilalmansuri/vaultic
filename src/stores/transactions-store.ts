import { create } from "zustand";
import { NETWORKS } from "@/config";
import type { Transaction, Network, Transactions } from "@/types";

interface TransactionsState {
  transactions: Transactions;
}

interface TransactionsActions {
  /** Clears all stored transactions across all networks. */
  clearTransactions: () => void;

  /**
   * Replaces all transactions with the provided object.
   * @param transactions The complete transactions object, grouped by network.
   */
  setTransactions: (transactions: Transactions) => void;

  /**
   * Adds a transaction to the specified network.
   * @param network The network the transaction belongs to.
   * @param transaction The transaction object to add.
   */
  addTransaction: (network: Network, transaction: Transaction) => void;
}

interface TransactionsStore extends TransactionsState {
  actions: TransactionsActions;
}

// Empty transaction history per network
const initialTransactions = Object.keys(NETWORKS).reduce((acc, network) => {
  acc[network as Network] = [];
  return acc;
}, {} as Transactions);

/* Zustand store for managing transaction history across networks. */
const useTransactionsStore = create<TransactionsStore>((set) => ({
  transactions: initialTransactions,

  actions: {
    clearTransactions: () => set({ transactions: initialTransactions }),

    setTransactions: (transactions) => set({ transactions }),

    addTransaction: (network, transaction) =>
      set((state) => ({
        transactions: {
          ...state.transactions,
          [network]: [transaction, ...state.transactions[network]],
        },
      })),
  },
}));

/** Returns the full transaction history grouped by network. */
export const useTransactions = () =>
  useTransactionsStore((state) => state.transactions);

/**
 * Provides actions to manage transactions:
 * clear, set, or add new transactions.
 */
export const useTransactionActions = () =>
  useTransactionsStore((state) => state.actions);
