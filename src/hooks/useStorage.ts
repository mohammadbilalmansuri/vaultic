import { getUserData, setUserData, clearUserData } from "@/utils/indexedDB";
import {
  hashPassword,
  verifyPassword,
  encryptMnemonic,
  decryptMnemonic,
} from "@/utils/crypto";
import { useUserStore } from "@/stores/userStore";
import { useWalletStore } from "@/stores/walletStore";

const useStorage = () => {
  const isUser = async (): Promise<boolean> => {
    const userData = await getUserData("user");
    return !!userData;
  };

  const loadUser = async (password: string): Promise<void> => {
    const userData = await getUserData("user");
    if (!userData) throw new Error("User not found");

    const isValid = await verifyPassword(password, userData.hashedPassword);
    if (!isValid) throw new Error("Invalid password");

    const decryptedMnemonic = decryptMnemonic(
      userData.encryptedMnemonic,
      password
    );
    if (!decryptedMnemonic) throw new Error("Decryption failed");

    useUserStore.getState().initUser({
      status: true,
      password,
      mnemonic: decryptedMnemonic,
      walletCounts: userData.walletCounts,
    });
  };

  const saveUser = async (): Promise<void> => {
    const status = useUserStore((state) => state.status);
    const password = useUserStore((state) => state.password);
    const mnemonic = useUserStore((state) => state.mnemonic);
    const walletCounts = useUserStore((state) => state.walletCounts);

    if (!status || !password || !mnemonic)
      throw new Error("User not authenticated");

    const existingData = await getUserData("user");
    const newData = existingData
      ? { ...existingData, walletCounts }
      : {
          hashedPassword: await hashPassword(password),
          encryptedMnemonic: encryptMnemonic(mnemonic, password),
          walletCounts,
        };

    await setUserData("user", newData);
  };

  const deleteUser = async (): Promise<void> => {
    await clearUserData();
    useUserStore.getState().logout();
    useWalletStore.getState().clearWallets();
  };

  return { isUser, loadUser, saveUser, deleteUser };
};

export default useStorage;
