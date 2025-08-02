import type { Accounts } from "@/types";
import {
  getAccountsState,
  getWalletState,
  useAccountActions,
  useNotificationActions,
  useWalletActions,
} from "@/stores";
import deriveAccount from "@/services/derive-account";
import useBlockchain from "./use-blockchain";
import useStorage from "./use-storage";

/**
 * Hook for managing wallet accounts including creation, deletion, and switching.
 * Handles HD wallet derivation, index management, and account state persistence.
 */
const useAccountManager = () => {
  const { fetchActiveAccountTransactions, refreshActiveAccount } =
    useBlockchain();
  const { saveWallet, updateWallet } = useStorage();

  const {
    addAccount,
    removeAccount,
    setAccounts,
    setActiveAccountIndex,
    setSwitchingToAccount,
  } = useAccountActions();
  const { setWalletState } = useWalletActions();
  const { notify } = useNotificationActions();

  /**
   * Creates a new account by deriving from the next available HD wallet index.
   * Finds the lowest unused index and derives addresses for all supported networks.
   * @param isInitialSetup - Whether this is the first account creation (affects save method)
   */
  const createAccount = async (isInitialSetup = false): Promise<void> => {
    try {
      const { indexes, mnemonic } = getWalletState();

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

      if (isInitialSetup) {
        await saveWallet();
      } else {
        await updateWallet();
      }

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
      const { indexes, mnemonic } = getWalletState();

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
      const { indexes } = getWalletState();
      const { activeAccountIndex } = getAccountsState();

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
    const { activeAccountIndex, switchingToAccount } = getAccountsState();

    if (switchingToAccount !== null || index === activeAccountIndex) return;

    setSwitchingToAccount(index);

    try {
      const { indexes } = getWalletState();

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

export default useAccountManager;
