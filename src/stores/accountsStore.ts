import { create } from "zustand";
import { Account, Accounts } from "@/types";

interface AccountsStore {
  accounts: Accounts;
  activeAccountIndex: number;
  switchingToAccount: number | null;
  addAccount: (index: number, account: Account) => void;
  removeAccount: (index: number) => void;
  setAccounts: (accounts: Accounts) => void;
  clearAccounts: () => void;
  getActiveAccount: () => Account;
  setActiveAccountIndex: (index: number) => void;
  updateActiveAccount: (account: Account) => void;
  setSwitchingToAccount: (accountIndex: number | null) => void;
}

/**
 * Accounts store for managing wallet accounts across multiple networks.
 * Handles account creation, deletion, switching, and balance updates.
 */
const useAccountsStore = create<AccountsStore>((set, get) => ({
  accounts: {},
  activeAccountIndex: 0,
  switchingToAccount: null,

  addAccount: (index, account) =>
    set(({ accounts }) => ({ accounts: { ...accounts, [index]: account } })),

  removeAccount: (index) =>
    set(({ accounts }) => {
      const { [index]: _, ...remaining } = accounts;
      return { accounts: remaining };
    }),

  setAccounts: (accounts: Accounts) => set(() => ({ accounts })),

  clearAccounts: () => set(() => ({ accounts: {}, activeAccountIndex: 0 })),

  getActiveAccount: () => {
    const { accounts, activeAccountIndex } = get();
    return accounts[activeAccountIndex];
  },

  setActiveAccountIndex: (index) => set(() => ({ activeAccountIndex: index })),

  updateActiveAccount: (account) =>
    set(({ accounts, activeAccountIndex }) => ({
      accounts: {
        ...accounts,
        [activeAccountIndex]: account,
      },
    })),

  setSwitchingToAccount: (accountIndex) =>
    set(() => ({ switchingToAccount: accountIndex })),
}));

export default useAccountsStore;
