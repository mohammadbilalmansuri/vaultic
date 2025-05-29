import { create } from "zustand";
import { TNetwork, TAccount, TAccounts } from "@/types";

interface IAccountsStore {
  accounts: TAccounts;
  activeAccountIndex: number;
  addAccount: (index: number, account: TAccount) => void;
  removeAccount: (index: number) => void;
  setAccounts: (accounts: TAccounts) => void;
  clearAccounts: () => void;
  getAccount: (index: number) => TAccount;
  setActiveAccountIndex: (index: number) => void;
  updateBalances: (index: number, balances: Record<TNetwork, string>) => void;
}

const useAccountsStore = create<IAccountsStore>((set, get) => ({
  accounts: {},
  activeAccountIndex: 0,

  addAccount: (index, account) =>
    set(({ accounts }) => ({ accounts: { ...accounts, [index]: account } })),

  removeAccount: (index) =>
    set(({ accounts }) => {
      const { [index]: _, ...remaining } = accounts;
      return { accounts: remaining };
    }),

  setAccounts: (accounts: TAccounts) => set(() => ({ accounts })),

  clearAccounts: () => set(() => ({ accounts: {}, activeAccountIndex: 0 })),

  getAccount: (index) => get().accounts[index] || {},

  setActiveAccountIndex: (index) => set(() => ({ activeAccountIndex: index })),

  updateBalances: (index, balances) =>
    set((state) => {
      const current = state.accounts[index];
      if (!current) return state;

      const updated: TAccount = { ...current };
      let changed = false;

      for (const network of Object.keys(balances) as TNetwork[]) {
        const currentNet = updated[network];
        const newBal = balances[network];

        if (currentNet && currentNet.balance !== newBal) {
          updated[network] = {
            ...currentNet,
            balance: newBal,
          };
          changed = true;
        }
      }

      if (!changed) return state;

      return {
        accounts: {
          ...state.accounts,
          [index]: updated,
        },
      };
    }),
}));

export default useAccountsStore;
