import { useRouter } from "next/navigation";
import type { UseFormSetError } from "react-hook-form";
import {
  useAccountActions,
  useNotificationActions,
  useWalletActions,
} from "@/stores";
import delay from "@/utils/delay";
import { VerifyPasswordForm } from "@/utils/validations";
import { useAccountManager, useStorage } from "@/hooks";

/**
 * Wallet management hook for authentication, wallet existence checks, and security operations.
 * Handles wallet unlock/lock operations with error handling and automatic security measures.
 */
const useWalletAuth = () => {
  const router = useRouter();
  const { isWalletStored, loadWallet, removeWallet } = useStorage();
  const { loadAccounts } = useAccountManager();

  const { setWalletState } = useWalletActions();
  const { clearAccounts } = useAccountActions();
  const { notify } = useNotificationActions();

  /**
   * Checks if a wallet exists in storage and updates wallet state.
   * Updates walletExists and walletStatus in the store.
   */
  const checkWalletExists = async () => {
    setWalletState({ walletStatus: "checking" });
    try {
      const exists = await isWalletStored();
      setWalletState({ walletExists: exists, walletStatus: "ready" });
    } catch {
      setWalletState({ walletStatus: "ready" });
      notify({ type: "error", message: "Failed to check wallet existence." });
    }
  };

  /**
   * Handles critical security failures by notifying user and resetting wallet.
   * Removes wallet data and redirects to start page after user notification.
   * @param message - Error message to display to user
   */
  const handleSecureFailure = async (message: string) => {
    try {
      notify({
        type: "error",
        message: `${message}. For your safety, we'll take you back to the start.`,
      });

      await delay(4000);
      await removeWallet();
      router.replace("/");
    } catch {
      notify({
        type: "error",
        message:
          "We couldn't reset your data automatically. Please clear this site's stored data from your browser settings and refresh the page to continue safely.",
      });
    }
  };

  /**
   * Unlocks wallet with password verification and loads account data.
   * Sets authentication state and handles password-specific errors.
   * @param password - User password for wallet decryption
   * @param setError - Form error setter for password validation feedback
   */
  const unlockWallet = async (
    { password }: VerifyPasswordForm,
    setError: UseFormSetError<VerifyPasswordForm>
  ) => {
    try {
      await loadWallet(password);
      await loadAccounts();
      setWalletState({ authenticated: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";

      if (message.toLowerCase().includes("password")) {
        setError("password", { message });
      } else {
        await handleSecureFailure(message);
      }
    }
  };

  /**
   * Locks wallet by clearing sensitive data from memory and resetting authentication.
   * Clears mnemonic, password, indexes, and account data for security.
   */
  const lockWallet = () => {
    setWalletState({
      authenticated: false,
      mnemonic: "",
      password: "",
      indexes: { inUse: [], deleted: [] },
    });
    clearAccounts();
  };

  return { checkWalletExists, unlockWallet, lockWallet };
};

export default useWalletAuth;
