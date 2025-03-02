import { useState } from "react";
import { setUserData, getUserData, clearUserData } from "../utils/db";
import {
  hashPassword,
  encryptMnemonic,
  decryptMnemonic,
} from "../utils/crypto";

export function useWalletStorage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function saveUserData(
    password: string,
    mnemonic: string,
    walletCounts: { eth: number; sol: number }
  ) {
    const hashedPass = await hashPassword(password);
    const encryptedMnemonic = await encryptMnemonic(mnemonic, hashedPass);
    await setUserData("user", { hashedPass, encryptedMnemonic, walletCounts });
  }

  async function verifyUser(password: string): Promise<{
    mnemonic: string;
    walletCounts: { eth: number; sol: number };
  } | null> {
    const storedData = await getUserData("user");
    if (!storedData) return null;

    const hashedPass = await hashPassword(password);
    if (hashedPass !== storedData.hashedPass) return null;

    const mnemonic = await decryptMnemonic(
      storedData.encryptedMnemonic,
      hashedPass
    );
    setIsAuthenticated(true);
    return { mnemonic, walletCounts: storedData.walletCounts };
  }

  async function logoutUser() {
    await clearUserData();
    setIsAuthenticated(false);
  }

  return { saveUserData, verifyUser, logoutUser, isAuthenticated };
}
