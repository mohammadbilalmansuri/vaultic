import { getUserData, saveUserData, clearUserData } from "@/services/indexedDB";
import {
  hashPassword,
  verifyPassword,
  encryptMnemonic,
  decryptMnemonic,
} from "@/utils/crypto";
import useUserStore from "@/stores/userStore";
import useWalletStore from "@/stores/walletStore";

const useStorage = () => {
  const { setUser, clearUser } = useUserStore.getState();
  const { clearWallets } = useWalletStore.getState();

  const isUser = async (): Promise<boolean> => {
    try {
      return Boolean(await getUserData("user"));
    } catch (error) {
      console.error("Error checking user existence:", error);
      throw new Error("Failed to check if user exists");
    }
  };

  const loadUser = async (password: string): Promise<void> => {
    try {
      const userData = await getUserData("user");
      if (!userData) throw new Error("User not found");

      const passwordValid = await verifyPassword(
        password,
        userData.hashedPassword
      );
      if (!passwordValid) throw new Error("Invalid password");

      const decryptedMnemonic = await decryptMnemonic(
        userData.encryptedMnemonic,
        password
      );
      if (!decryptedMnemonic) throw new Error("Decryption failed");

      setUser({
        password,
        mnemonic: decryptedMnemonic,
        indexes: userData.indexes,
        deletedIndexes: userData.deletedIndexes,
        networkMode: userData.networkMode,
      });
    } catch (error) {
      console.error("Error loading user:", error);
      throw error;
    }
  };

  const saveUser = async (): Promise<void> => {
    try {
      const { password, mnemonic, indexes, deletedIndexes, networkMode } =
        useUserStore.getState();

      if (!mnemonic) throw new Error("Mnemonic is missing");

      const existingData = await getUserData("user");

      let hashedPassword = existingData?.hashedPassword ?? null;
      let encryptedMnemonic = existingData?.encryptedMnemonic ?? null;

      if (!hashedPassword || !encryptedMnemonic) {
        if (!password) throw new Error("Password is missing");

        [hashedPassword, encryptedMnemonic] = await Promise.all([
          hashPassword(password),
          encryptMnemonic(mnemonic, password),
        ]);
      }

      if (!hashedPassword || !encryptedMnemonic) {
        throw new Error("Encryption failed");
      }

      await saveUserData("user", {
        hashedPassword,
        encryptedMnemonic,
        indexes,
        deletedIndexes,
        networkMode,
      });
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  };

  const removeUser = async (): Promise<void> => {
    try {
      await clearUserData();
      await Promise.all([clearUser(), clearWallets()]);
    } catch (error) {
      throw error;
    }
  };

  return { isUser, loadUser, saveUser, removeUser };
};

export default useStorage;
