import { create } from "zustand";
import { NETWORKS } from "@/config";
import type { TransactionRecord, Network, Transactions } from "@/types";

interface TransactionsStore {
  transactions: Transactions;
  clearTransactions: () => void;
  setTransactions: (transactions: Transactions) => void;
  addTransaction: (network: Network, transaction: TransactionRecord) => void;
}

// Initializes empty transaction arrays for all supported networks
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

  clearTransactions: () => set({ transactions: initialTransactions }),

  setTransactions: (transactions: Transactions) => set({ transactions }),

  addTransaction: (network: Network, transaction: TransactionRecord) =>
    set((state) => ({
      transactions: {
        ...state.transactions,
        [network]: [transaction, ...state.transactions[network]],
      },
    })),
}));

export default useTransactionsStore;
