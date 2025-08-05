import { create } from "zustand";
import type { Account, Accounts } from "@/types";

interface AccountsState {
  accounts: Accounts;
  activeAccountIndex: number;
  switchingToAccount: number | null;
}

interface AccountsActions {
  addAccount: (index: number, account: Account) => void;
  removeAccount: (index: number) => void;
  setAccounts: (accounts: Accounts) => void;
  clearAccounts: () => void;
  getActiveAccount: () => Account;
  setActiveAccountIndex: (index: number) => void;
  updateActiveAccount: (account: Account) => void;
  setSwitchingToAccount: (accountIndex: number | null) => void;
}

interface AccountsStore extends AccountsState {
  actions: AccountsActions;
}

/**
 * Accounts store for managing wallet accounts across multiple networks.
 * Handles account creation, deletion, switching, and balance updates.
 */
const useAccountsStore = create<AccountsStore>((set, get) => ({
  accounts: {},
  activeAccountIndex: 0,
  switchingToAccount: null,

  actions: {
    addAccount: (index, account) =>
      set(({ accounts }) => ({ accounts: { ...accounts, [index]: account } })),

    removeAccount: (index) =>
      set(({ accounts }) => {
        const remainingAccounts = { ...accounts };
        delete remainingAccounts[index];
        return { accounts: remainingAccounts };
      }),

    setAccounts: (accounts: Accounts) => set(() => ({ accounts })),

    clearAccounts: () => set(() => ({ accounts: {}, activeAccountIndex: 0 })),

    getActiveAccount: () => {
      const { accounts, activeAccountIndex } = get();
      return accounts[activeAccountIndex];
    },

    setActiveAccountIndex: (index) =>
      set(() => ({ activeAccountIndex: index })),

    updateActiveAccount: (account) =>
      set(({ accounts, activeAccountIndex }) => ({
        accounts: {
          ...accounts,
          [activeAccountIndex]: account,
        },
      })),

    setSwitchingToAccount: (accountIndex) =>
      set(() => ({ switchingToAccount: accountIndex })),
  },
}));

export const useAccounts = () => useAccountsStore((state) => state.accounts);

export const useActiveAccountIndex = () =>
  useAccountsStore((state) => state.activeAccountIndex);

export const useSwitchingToAccount = () =>
  useAccountsStore((state) => state.switchingToAccount);

export const useActiveAccount = () =>
  useAccountsStore((state) => state.actions.getActiveAccount());

export const useAccountActions = () =>
  useAccountsStore((state) => state.actions);

export const getAccountsState = () => useAccountsStore.getState();
