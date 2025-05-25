import { useWalletStore, useAccountsStore } from "@/stores";
import { useBlockchain } from "@/hooks";
import { TNetwork, TAccounts } from "@/types";
import deriveAccount from "@/services/deriveAccount";

const useAccounts = () => {
  const { setWalletState } = useWalletStore.getState();
  const { addAccount, removeAccount, setAccounts, updateBalances } =
    useAccountsStore.getState();
  const { fetchBalance } = useBlockchain();

  const createAccount = async (): Promise<void> => {
    try {
      const { mnemonic, indexes } = useWalletStore.getState();
      if (!mnemonic) throw new Error("Mnemonic not available");

      const inUseIndexes = new Set(indexes.inUse);
      const deletedIndexes = new Set(indexes.deleted);
      let nextIndex = 0;

      while (inUseIndexes.has(nextIndex) || deletedIndexes.has(nextIndex)) {
        nextIndex++;
      }

      const account = await deriveAccount(mnemonic, nextIndex);

      addAccount(nextIndex, account);
      setWalletState({
        indexes: {
          inUse: [...inUseIndexes, nextIndex],
          deleted: [...deletedIndexes],
        },
      });
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  };

  const deleteAccount = async (index: number): Promise<void> => {
    try {
      const { indexes } = useWalletStore.getState();
      removeAccount(index);
      setWalletState({
        indexes: {
          inUse: indexes.inUse.filter((i) => i !== index),
          deleted: [...indexes.deleted, index],
        },
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  };

  const loadAccounts = async (): Promise<void> => {
    try {
      const { mnemonic, indexes } = useWalletStore.getState();
      if (!mnemonic) throw new Error("Mnemonic not available");

      const accounts: TAccounts = {};

      for (const index of indexes.inUse) {
        const account = await deriveAccount(mnemonic, index);
        accounts[index] = account;
      }

      setAccounts(accounts);
    } catch (error) {
      console.error("Error loading accounts:", error);
      throw error;
    }
  };

  const updateActiveAccountBalances = async (): Promise<void> => {
    const { getActiveAccount, activeAccountIndex } =
      useAccountsStore.getState();

    const activeAccount = getActiveAccount();
    if (!activeAccount) throw new Error("No active account found");

    const networks = Object.keys(activeAccount) as TNetwork[];

    const entries = await Promise.all(
      networks.map(async (network) => {
        const address = activeAccount[network].address;
        const balance = await fetchBalance({ network, address });
        return [network, balance] as [TNetwork, string];
      })
    );

    const balances = Object.fromEntries(entries) as Record<TNetwork, string>;

    updateBalances(activeAccountIndex, balances);
  };

  return {
    createAccount,
    deleteAccount,
    loadAccounts,
    updateActiveAccountBalances,
  };
};

export default useAccounts;
