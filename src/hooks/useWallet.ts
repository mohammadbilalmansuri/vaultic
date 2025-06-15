import { useRouter } from "next/navigation";
import { UseFormSetError } from "react-hook-form";
import {
  useWalletStore,
  useNotificationStore,
  useAccountsStore,
} from "@/stores";
import delay from "@/utils/delay";
import { TVerifyPasswordForm } from "@/utils/validations";
import { useStorage, useAccounts } from "@/hooks";

const useWallet = () => {
  const router = useRouter();
  const { isWalletStored, loadWallet, removeWallet } = useStorage();
  const { loadAccounts } = useAccounts();
  const setWalletState = useWalletStore((state) => state.setWalletState);
  const clearAccounts = useAccountsStore((state) => state.clearAccounts);
  const notify = useNotificationStore((state) => state.notify);

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

  const handleSecureFailure = async (message: string) => {
    try {
      notify({
        type: "error",
        message: `${message}. For your safety, we’ll take you back to the start.`,
      });

      await delay(4000);
      await removeWallet();
      router.replace("/");
    } catch (error) {
      notify({
        type: "error",
        message:
          "We couldn’t reset your data automatically. Please clear this site’s stored data from your browser settings and refresh the page to continue safely.",
      });
    }
  };

  const unlockWallet = async (
    { password }: TVerifyPasswordForm,
    setError: UseFormSetError<TVerifyPasswordForm>
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

export default useWallet;
