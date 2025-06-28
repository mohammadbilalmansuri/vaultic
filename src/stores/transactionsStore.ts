import { create } from "zustand";
import { NETWORKS } from "@/config";
import { ITransaction, TNetwork, TTransactions } from "@/types";

interface ITransactionsStore {
  transactions: TTransactions;
  clearTransactions: () => void;
  setTransactions: (transactions: TTransactions) => void;
  addTransaction: (network: TNetwork, transaction: ITransaction) => void;
}

// Initializes empty transaction arrays for all supported networks
const initialTransactions = Object.keys(NETWORKS).reduce((acc, network) => {
  acc[network as TNetwork] = [];
  return acc;
}, {} as TTransactions);

/**
 * Transactions store for managing transaction history across all networks in the active account.
 * Handles transaction caching, updates, and network-specific organization.
 */
const useTransactionsStore = create<ITransactionsStore>((set) => ({
  transactions: initialTransactions,

  clearTransactions: () => set({ transactions: initialTransactions }),

  setTransactions: (transactions: TTransactions) => set({ transactions }),

  addTransaction: (network: TNetwork, transaction: ITransaction) =>
    set((state) => ({
      transactions: {
        ...state.transactions,
        [network]: [transaction, ...state.transactions[network]],
      },
    })),
}));

export default useTransactionsStore;
