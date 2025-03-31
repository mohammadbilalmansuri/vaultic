import { getUserData, setUserData, clearUserData } from "@/services/indexedDB";
import {
  hashPassword,
  verifyPassword,
  encryptMnemonic,
  decryptMnemonic,
} from "@/utils/crypto";
import { useUserStore } from "@/stores/userStore";
import { useWalletStore } from "@/stores/walletStore";

const useStorage = () => {
  const initUser = useUserStore((state) => state.initUser);
  const logout = useUserStore((state) => state.logout);
  const clearWallets = useWalletStore((state) => state.clearWallets);

  const isUser = async (): Promise<boolean> => {
    try {
      return !!(await getUserData("user"));
    } catch (error) {
      console.error("Error checking user:", error);
      return false;
    }
  };

  const loadUser = async (password: string): Promise<void> => {
    try {
      const userData = await getUserData("user");
      if (!userData) {
        await removeUser();
        throw new Error("User not found");
      }

      if (!(await verifyPassword(password, userData.hashedPassword))) {
        throw new Error("Invalid password");
      }

      const decryptedMnemonic = await decryptMnemonic(
        userData.encryptedMnemonic,
        password
      );

      if (!decryptedMnemonic) {
        await removeUser();
        throw new Error("Decryption failed");
      }

      initUser({
        password,
        mnemonic: decryptedMnemonic,
        indexes: userData.indexes || [],
      });
    } catch (error) {
      console.error("Error loading user:", error);
      throw error;
    }
  };

  const saveUser = async (): Promise<void> => {
    try {
      const { password, mnemonic, indexes } = useUserStore.getState();
      if (!mnemonic) throw new Error("Mnemonic is missing");

      const existingData = await getUserData("user");

      const hashedPassword =
        existingData?.hashedPassword ||
        (password ? await hashPassword(password) : null);

      const encryptedMnemonic =
        existingData?.encryptedMnemonic ||
        (password ? await encryptMnemonic(mnemonic, password) : null);

      if (!hashedPassword || !encryptedMnemonic) {
        throw new Error("Encryption failed");
      }

      await setUserData("user", { hashedPassword, encryptedMnemonic, indexes });
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  };

  const removeUser = async (): Promise<void> => {
    try {
      await clearUserData();
    } catch (error) {
      console.error("Error clearing user data:", error);
    }

    await Promise.all([logout(), clearWallets()]);
  };

  return { isUser, loadUser, saveUser, removeUser };
};

export default useStorage;
