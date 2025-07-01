import {
  useWalletStore,
  useAccountsStore,
  useTransactionsStore,
} from "@/stores";
import {
  getWalletData,
  saveWalletData,
  clearWalletData,
} from "@/services/indexedDB";
import {
  hashPassword,
  verifyPassword,
  encryptMnemonic,
  decryptMnemonic,
} from "@/utils/crypto";

/**
 * Storage management hook for wallet persistence, encryption, and IndexedDB operations.
 * Handles wallet creation, loading, updating, password changes, and secure deletion.
 */
const useStorage = () => {
  const { setWalletState, clearWallet } = useWalletStore.getState();
  const { setActiveAccountIndex, clearAccounts } = useAccountsStore.getState();
  const { clearTransactions } = useTransactionsStore.getState();

  /**
   * Checks if a wallet exists in IndexedDB storage.
   * @returns Promise resolving to true if wallet exists
   */
  const isWalletStored = async (): Promise<boolean> => {
    try {
      return Boolean(await getWalletData("wallet"));
    } catch (error) {
      console.error("Error checking wallet existence:", error);
      throw error;
    }
  };

  /**
   * Saves current wallet state to encrypted storage.
   * Encrypts mnemonic with password and hashes password for verification.
   */
  const saveWallet = async (): Promise<void> => {
    try {
      const { mnemonic, password, indexes, networkMode } =
        useWalletStore.getState();
      const { activeAccountIndex } = useAccountsStore.getState();

      if (!mnemonic || !password)
        throw new Error("Missing mnemonic or password");

      const [encryptedMnemonic, hashedPassword] = await Promise.all([
        encryptMnemonic(mnemonic, password),
        hashPassword(password),
      ]);

      await saveWalletData("wallet", {
        encryptedMnemonic,
        hashedPassword,
        indexes,
        networkMode,
        activeAccountIndex,
      });
    } catch (error) {
      console.error("Error saving wallet:", error);
      throw error;
    }
  };

  /**
   * Loads wallet from storage and decrypts with provided password.
   * Verifies password and updates wallet state with decrypted data.
   * @param password - User password for wallet decryption
   */
  const loadWallet = async (password: string): Promise<void> => {
    try {
      const wallet = await getWalletData("wallet");
      if (!wallet) throw new Error("Wallet not found");

      const passwordValid = await verifyPassword(
        password,
        wallet.hashedPassword
      );
      if (!passwordValid) throw new Error("Incorrect password");

      const decryptedMnemonic = await decryptMnemonic(
        wallet.encryptedMnemonic,
        password
      );

      setWalletState({
        password,
        mnemonic: decryptedMnemonic,
        indexes: wallet.indexes,
        networkMode: wallet.networkMode,
      });
      setActiveAccountIndex(wallet.activeAccountIndex);
    } catch (error) {
      console.error("Error loading wallet:", error);
      throw error;
    }
  };

  /**
   * Updates wallet metadata without changing encrypted mnemonic.
   * Used for updating indexes, network mode, and active account.
   */
  const updateWallet = async (): Promise<void> => {
    try {
      const { indexes, networkMode } = useWalletStore.getState();
      const { activeAccountIndex } = useAccountsStore.getState();

      const wallet = await getWalletData("wallet");
      if (!wallet) throw new Error("Wallet not found");

      await saveWalletData("wallet", {
        ...wallet,
        indexes,
        networkMode,
        activeAccountIndex,
      });
    } catch (error) {
      console.error("Error updating wallet:", error);
      throw error;
    }
  };

  /**
   * Changes wallet password by re-encrypting mnemonic and updating hash.
   * @param currentPassword - Current wallet password for verification
   * @param newPassword - New password for encryption
   */
  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    try {
      const { password, mnemonic } = useWalletStore.getState();
      if (password !== currentPassword) {
        throw new Error("Incorrect current password");
      }

      const wallet = await getWalletData("wallet");
      if (!wallet) throw new Error("Wallet not found");

      const [newEncryptedMnemonic, newHashedPassword] = await Promise.all([
        encryptMnemonic(mnemonic, newPassword),
        hashPassword(newPassword),
      ]);

      await saveWalletData("wallet", {
        ...wallet,
        hashedPassword: newHashedPassword,
        encryptedMnemonic: newEncryptedMnemonic,
      });

      setWalletState({ password: newPassword });
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  };

  /**
   * Completely removes wallet from storage and clears all related state.
   * Clears IndexedDB data and resets all Zustand stores.
   */
  const removeWallet = async (): Promise<void> => {
    try {
      await clearWalletData();
      await Promise.all([clearWallet(), clearAccounts(), clearTransactions()]);
    } catch (error) {
      console.error("Error removing wallet:", error);
      throw error;
    }
  };

  return {
    isWalletStored,
    loadWallet,
    saveWallet,
    updateWallet,
    updatePassword,
    removeWallet,
  };
};

export default useStorage;
