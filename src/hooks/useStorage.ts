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
    const userData = await getUserData("user");
    return !!userData;
  };

  const loadUser = async (password: string): Promise<void> => {
    const userData = await getUserData("user");
    if (!userData) throw new Error("User not found");

    const isValid = await verifyPassword(password, userData.hashedPassword);
    if (!isValid) throw new Error("Invalid password");

    const decryptedMnemonic = await decryptMnemonic(
      userData.encryptedMnemonic,
      password
    );
    if (!decryptedMnemonic) throw new Error("Decryption failed");

    return new Promise((resolve) => {
      initUser({
        password,
        mnemonic: decryptedMnemonic,
        indexes: userData.indexes || [],
      });
      resolve();
    });
  };

  const saveUser = async (): Promise<void> => {
    const { password, mnemonic, indexes } = useUserStore.getState();

    const existingData = await getUserData("user");

    const newData = existingData
      ? { ...existingData, indexes }
      : {
          hashedPassword: await hashPassword(password),
          encryptedMnemonic: await encryptMnemonic(mnemonic, password),
          indexes,
        };

    await setUserData("user", newData);
  };

  const removeUser = async (): Promise<void> => {
    await clearUserData();
    logout();
    clearWallets();
  };

  return { isUser, loadUser, saveUser, removeUser };
};

export default useStorage;
