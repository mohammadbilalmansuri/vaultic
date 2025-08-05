import { create } from "zustand";
import type { Account, Accounts } from "@/types";

interface AccountsState {
  accounts: Accounts;
  activeAccountIndex: number;
  switchingToAccount: number | null;
}

interface AccountsActions {
  /**
   * Adds a new account at the given index.
   * @param index Index at which to add the account.
   * @param account Account data to add.
   */
  addAccount: (index: number, account: Account) => void;

  /**
   * Removes an account by its index.
   * @param index Index of the account to remove.
   */
  removeAccount: (index: number) => void;

  /**
   * Replaces the entire accounts object.
   * @param accounts New accounts object to set.
   */
  setAccounts: (accounts: Accounts) => void;

  /**
   * Clears all accounts and resets active index.
   */
  clearAccounts: () => void;

  /**
   * Returns the currently active account.
   * @returns The active account object.
   */
  getActiveAccount: () => Account;

  /**
   * Sets the index of the currently active account.
   * @param index Index of the account to set as active.
   */
  setActiveAccountIndex: (index: number) => void;

  /**
   * Updates the active account with new data.
   * @param account Updated account data to replace the current active account.
   */
  updateActiveAccount: (account: Account) => void;

  /**
   * Sets the index of the account the user is switching to.
   * @param accountIndex Index of the target account, or null to clear.
   */
  setSwitchingToAccount: (accountIndex: number | null) => void;
}

interface AccountsStore extends AccountsState {
  actions: AccountsActions;
}

/* Zustand store for managing wallet accounts */
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

    setAccounts: (accounts) => set(() => ({ accounts })),

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

/** Returns the full accounts object keyed by index. */
export const useAccounts = () => useAccountsStore((state) => state.accounts);

/** Returns the index of the currently active account. */
export const useActiveAccountIndex = () =>
  useAccountsStore((state) => state.activeAccountIndex);

/** Returns the index of the account currently being switched to. */
export const useSwitchingToAccount = () =>
  useAccountsStore((state) => state.switchingToAccount);

/** Returns the currently active account object. */
export const useActiveAccount = () =>
  useAccountsStore((state) => state.actions.getActiveAccount());

/**
 * Provides account management actions such as add, remove, update, and switch.
 */
export const useAccountActions = () =>
  useAccountsStore((state) => state.actions);

/**
 * Returns the full accounts store state (non-reactive).
 * Useful for accessing outside React render lifecycle.
 */
export const getAccountsState = () => useAccountsStore.getState();
