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

    initUser({
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
          encryptedMnemonic: await encryptMnemonic(mnemonic, password),
          walletCounts,
        };

    await setUserData("user", newData);
  };

  const deleteUser = async (): Promise<void> => {
    await clearUserData();
    logout();
    clearWallets();
  };

  return { isUser, loadUser, saveUser, deleteUser };
};

export default useStorage;
