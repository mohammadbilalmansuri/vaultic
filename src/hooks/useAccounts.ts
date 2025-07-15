import type { Accounts } from "@/types";
import {
  useWalletStore,
  useAccountsStore,
  useNotificationStore,
} from "@/stores";
import deriveAccount from "@/services/deriveAccount";
import useBlockchain from "./useBlockchain";
import useStorage from "./useStorage";

/**
 * Hook for managing wallet accounts including creation, deletion, and switching.
 * Handles HD wallet derivation, index management, and account state persistence.
 */
const useAccounts = () => {
  const { fetchActiveAccountTransactions, refreshActiveAccount } =
    useBlockchain();
  const { saveWallet, updateWallet } = useStorage();
  const { notify } = useNotificationStore.getState();
  const { setWalletState } = useWalletStore.getState();
  const {
    addAccount,
    removeAccount,
    setAccounts,
    setActiveAccountIndex,
    setSwitchingToAccount,
  } = useAccountsStore.getState();

  /**
   * Creates a new account by deriving from the next available HD wallet index.
   * Finds the lowest unused index and derives addresses for all supported networks.
   * @param isInitialSetup - Whether this is the first account creation (affects save method)
   */
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

  /**
   * Loads all existing accounts from stored indexes.
   * Derives accounts for all in-use indexes and updates store state.
   */
  const loadAccounts = async (): Promise<void> => {
    try {
      const { mnemonic, indexes } = useWalletStore.getState();
      if (!mnemonic) throw new Error("Mnemonic not available");

      const accounts: Accounts = {};

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

  /**
   * Deletes an account by moving its index to the deleted list.
   * Automatically switches to another account if deleting the active one.
   * @param index - HD wallet derivation index to delete
   */
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

  /**
   * Switches the active account to the specified index.
   * Prevents switching if already in progress or if the selected index is already active.
   * Validates the index, updates the active account state, and refreshes its balances and transactions.
   * Also shows a notification on success or failure.
   * @param index - HD wallet derivation index to switch to
   */
  const switchActiveAccount = async (index: number): Promise<void> => {
    const { activeAccountIndex, switchingToAccount } =
      useAccountsStore.getState();

    if (switchingToAccount !== null || index === activeAccountIndex) return;

    setSwitchingToAccount(index);

    try {
      const { indexes } = useWalletStore.getState();

      if (!indexes.inUse.includes(index)) {
        throw new Error(`Account index ${index} does not exist`);
      }

      setActiveAccountIndex(index);
      await updateWallet();
      await refreshActiveAccount();

      notify({ type: "success", message: `Switched to Account ${index + 1}` });
    } catch {
      notify({ type: "error", message: `Failed to switch account` });
    } finally {
      setSwitchingToAccount(null);
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
