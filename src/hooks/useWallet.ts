"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore, useNotificationStore } from "@/stores";
import { useStorage, useAccounts } from "@/hooks";
import delay from "@/utils/delay";
import { UseFormSetError } from "react-hook-form";
import { TVerifyPasswordForm } from "@/utils/validations";

const useWallet = () => {
  const router = useRouter();
  const { saveWallet, isWalletStored, loadWallet, removeWallet } = useStorage();
  const { createAccount, loadAccounts } = useAccounts();
  const setWalletState = useWalletStore((state) => state.setWalletState);
  const notify = useNotificationStore((state) => state.notify);
  const [settingUp, startSettingUp] = useTransition();
  const [unlocking, startUnlocking] = useTransition();

  const setupWallet = () => {
    startSettingUp(async () => {
      try {
        await createAccount();
        await saveWallet();
        await delay(3000);
      } catch (error) {
        notify({
          type: "error",
          message: "Failed to create wallet. Please try again.",
        });
      }
    });
  };

  const walletExists = async () => {
    try {
      const exists =
        useWalletStore.getState().walletExists || (await isWalletStored());
      return exists;
    } catch (error) {
      console.error("Error checking wallet existence:", error);
      throw error;
    }
  };

  const handleSecureFailure = async (message: string) => {
    try {
      notify({
        type: "error",
        message: `${message}. For your safety, we'll take you back to the start.`,
      });

      await delay(4000);
      await removeWallet();
      router.replace("/");
    } catch (error) {
      notify({
        type: "error",
        message:
          "We couldn't reset your data automatically. Please clear this site's stored data from your browser settings and refresh the page to continue safely.",
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
    setupWallet,
    settingUp,
    walletExists,
    unlockWallet,
    unlocking,
  };
};

export default useWallet;
