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
  const setUserState = useUserStore((state) => state.setUserState);
  const clearUser = useUserStore((state) => state.clearUser);
  const clearWallets = useWalletStore((state) => state.clearWallets);

  const isUser = async (): Promise<boolean> => {
    try {
      return Boolean(await getUserData("user"));
    } catch (error) {
      console.error("Error checking user existence:", error);
      throw error;
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
      if (!decryptedMnemonic) throw new Error("Mnemonic decryption failed");

      setUserState({
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
      const { mnemonic, password, indexes, deletedIndexes, networkMode } =
        useUserStore.getState();

      if (!mnemonic || !password)
        throw new Error("Missing mnemonic or password");

      const [encryptedMnemonic, hashedPassword] = await Promise.all([
        encryptMnemonic(mnemonic, password),
        hashPassword(password),
      ]);

      if (!encryptedMnemonic || !hashedPassword)
        throw new Error("Mnemonic encryption failed");

      await saveUserData("user", {
        encryptedMnemonic,
        hashedPassword,
        indexes,
        deletedIndexes,
        networkMode,
      });
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  };

  const saveUserMetadata = async (): Promise<void> => {
    try {
      const { indexes, deletedIndexes, networkMode } = useUserStore.getState();

      const existingData = await getUserData("user");
      if (!existingData) throw new Error("User not found");

      await saveUserData("user", {
        ...existingData,
        indexes,
        deletedIndexes,
        networkMode,
      });
    } catch (error) {
      console.error("Error saving user metadata:", error);
      throw error;
    }
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    try {
      const userData = await getUserData("user");
      if (!userData) throw new Error("User not found");

      const isValid = await verifyPassword(
        currentPassword,
        userData.hashedPassword
      );
      if (!isValid) throw new Error("Invalid current password");

      const decryptedMnemonic = await decryptMnemonic(
        userData.encryptedMnemonic,
        currentPassword
      );
      if (!decryptedMnemonic) throw new Error("Mnemonic decryption failed");

      const [newEncryptedMnemonic, newHashedPassword] = await Promise.all([
        encryptMnemonic(decryptedMnemonic, newPassword),
        hashPassword(newPassword),
      ]);
      if (!newEncryptedMnemonic || !newHashedPassword)
        throw new Error("Encryption failed");

      await saveUserData("user", {
        ...userData,
        hashedPassword: newHashedPassword,
        encryptedMnemonic: newEncryptedMnemonic,
      });

      useUserStore.setState({ password: newPassword });
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  };

  const removeUser = async (): Promise<void> => {
    try {
      await clearUserData();
      await Promise.all([clearUser(), clearWallets()]);
    } catch (error) {
      console.error("Error removing user:", error);
      throw error;
    }
  };

  const getMnemonic = async (password: string): Promise<string> => {
    try {
      const userData = await getUserData("user");
      if (!userData) throw new Error("User not found");

      const isValid = await verifyPassword(password, userData.hashedPassword);
      if (!isValid) throw new Error("Invalid password");

      const decryptedMnemonic = await decryptMnemonic(
        userData.encryptedMnemonic,
        password
      );
      if (!decryptedMnemonic) throw new Error("Mnemonic decryption failed");

      return decryptedMnemonic;
    } catch (error) {
      console.error("Error getting mnemonic:", error);
      throw error;
    }
  };

  return {
    isUser,
    loadUser,
    saveUser,
    saveUserMetadata,
    updatePassword,
    removeUser,
    getMnemonic,
  };
};

export default useStorage;
