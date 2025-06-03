import { create } from "zustand";
import { TAccount, TAccounts } from "@/types";

interface IAccountsStore {
  accounts: TAccounts;
  activeAccountIndex: number;
  switchingActiveAccount: boolean;
  addAccount: (index: number, account: TAccount) => void;
  removeAccount: (index: number) => void;
  setAccounts: (accounts: TAccounts) => void;
  clearAccounts: () => void;
  getActiveAccount: () => TAccount;
  setActiveAccountIndex: (index: number) => void;
  updateActiveAccount: (account: TAccount) => void;
  setSwitchingActiveAccount: (switching: boolean) => void;
}

const useAccountsStore = create<IAccountsStore>((set, get) => ({
  accounts: {},
  activeAccountIndex: 0,
  switchingActiveAccount: false,

  addAccount: (index, account) =>
    set(({ accounts }) => ({ accounts: { ...accounts, [index]: account } })),

  removeAccount: (index) =>
    set(({ accounts }) => {
      const { [index]: _, ...remaining } = accounts;
      return { accounts: remaining };
    }),

  setAccounts: (accounts: TAccounts) => set(() => ({ accounts })),

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

  setSwitchingActiveAccount: (switching) =>
    set(() => ({ switchingActiveAccount: switching })),
}));

export default useAccountsStore;
