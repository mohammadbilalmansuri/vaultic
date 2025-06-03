import { useWalletStore, useAccountsStore, useActivityStore } from "@/stores";
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

const useStorage = () => {
  const { setWalletState, clearWallet } = useWalletStore.getState();
  const { setActiveAccountIndex, clearAccounts } = useAccountsStore.getState();
  const { clearActivities } = useActivityStore.getState();

  const isWalletStored = async (): Promise<boolean> => {
    try {
      return Boolean(await getWalletData("wallet"));
    } catch (error) {
      console.error("Error checking wallet existence:", error);
      throw error;
    }
  };

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

  const loadWallet = async (password: string): Promise<void> => {
    try {
      const wallet = await getWalletData("wallet");
      if (!wallet) throw new Error("Wallet not found");

      const passwordValid = await verifyPassword(
        password,
        wallet.hashedPassword
      );
      if (!passwordValid) throw new Error("Invalid password");

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

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    try {
      const { password, mnemonic } = useWalletStore.getState();
      if (password !== currentPassword)
        throw new Error("Invalid current password");

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

  const removeWallet = async (): Promise<void> => {
    try {
      await clearWalletData();
      await Promise.all([clearWallet(), clearAccounts(), clearActivities()]);
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
