import { TAccounts } from "@/types";
import { useWalletStore, useAccountsStore } from "@/stores";
import deriveAccount from "@/services/deriveAccount";
import useBlockchain from "./useBlockchain";
import useStorage from "./useStorage";

const useAccounts = () => {
  const { fetchActiveAccountTransactions, refreshActiveAccount } =
    useBlockchain();
  const { saveWallet, updateWallet } = useStorage();
  const { setWalletState } = useWalletStore.getState();
  const { addAccount, removeAccount, setAccounts, setActiveAccountIndex } =
    useAccountsStore.getState();

  const createAccount = async (isInitialSetup = false): Promise<void> => {
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
      setActiveAccountIndex(nextIndex);
      setWalletState({
        indexes: {
          inUse: [...inUseIndexes, nextIndex],
          deleted: [...deletedIndexes],
        },
      });

      isInitialSetup ? await saveWallet() : await updateWallet();
      await fetchActiveAccountTransactions();
    } catch (error) {
      console.error("Error creating account:", error);
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
      await fetchActiveAccountTransactions();
    } catch (error) {
      console.error("Error loading accounts:", error);
      throw error;
    }
  };

  const deleteAccount = async (index: number): Promise<void> => {
    try {
      const { indexes } = useWalletStore.getState();
      const { activeAccountIndex } = useAccountsStore.getState();

      if (indexes.inUse.length <= 1) {
        throw new Error("Cannot delete the last remaining account");
      }

      const updatedInUseIndexes = indexes.inUse.filter((i) => i !== index);

      if (activeAccountIndex === index) {
        const nextActiveIndex = Math.min(...updatedInUseIndexes);
        setActiveAccountIndex(nextActiveIndex);
        await refreshActiveAccount();
      }

      removeAccount(index);
      setWalletState({
        indexes: {
          inUse: updatedInUseIndexes,
          deleted: [...indexes.deleted, index],
        },
      });
      await updateWallet();
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  };

  const switchActiveAccount = async (index: number): Promise<void> => {
    try {
      const { indexes } = useWalletStore.getState();
      if (!indexes.inUse.includes(index)) {
        throw new Error(`Account index ${index} does not exist`);
      }
      setActiveAccountIndex(index);
      await updateWallet();
      await refreshActiveAccount();
    } catch (error) {
      console.error("Error switching active account:", error);
      throw error;
    }
  };

  return {
    createAccount,
    deleteAccount,
    loadAccounts,
    switchActiveAccount,
  };
};

export default useAccounts;
