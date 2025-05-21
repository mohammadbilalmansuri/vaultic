"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { UseFormSetError } from "react-hook-form";
import { useWalletStore, useNotificationStore } from "@/stores";
import { useStorage, useAccounts } from "@/hooks";
import { TVerifyPasswordForm } from "@/utils/validations";
import delay from "@/utils/delay";

const useWallet = () => {
  const router = useRouter();
  const { isWalletStored, loadWallet, removeWallet } = useStorage();
  const { loadAccounts } = useAccounts();
  const setWalletState = useWalletStore((state) => state.setWalletState);
  const notify = useNotificationStore((state) => state.notify);
  const [unlocking, startUnlocking] = useTransition();

  const checkWalletExists = async () => {
    setWalletState({ checkingWallet: true });
    try {
      let exists = useWalletStore.getState().walletExists;
      if (!exists) {
        exists = await isWalletStored();
        setWalletState({ walletExists: exists });
      }
    } catch (error) {
      notify({
        type: "error",
        message: "Failed to check wallet existence. Please try again.",
      });
    } finally {
      setWalletState({ checkingWallet: false });
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

  const unlockWallet = (
    { password }: TVerifyPasswordForm,
    setError: UseFormSetError<TVerifyPasswordForm>
  ) => {
    startUnlocking(async () => {
      try {
        await loadWallet(password);
        await loadAccounts();
        setWalletState({ authenticated: true });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";

        if (message.includes("password") || message.includes("invalid")) {
          setError("password", { message });
        } else {
          await handleSecureFailure(message);
        }
      }
    });
  };

  return {
    checkWalletExists,
    unlockWallet,
    unlocking,
  };
};

export default useWallet;
