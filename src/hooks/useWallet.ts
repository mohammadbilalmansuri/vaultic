"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useStorage, useAccounts } from "@/hooks";
import { useWalletStore } from "@/stores";
import useNotificationStore from "@/stores/notificationStore";
import { TVerifyPasswordFormData } from "@/utils/validations";
import { UseFormSetError } from "react-hook-form";
import delay from "@/utils/delay";

const useWallet = () => {
  const router = useRouter();
  const { isWalletStored, loadWallet, removeWallet } = useStorage();
  const { loadAccounts } = useAccounts();
  const setWalletState = useWalletStore((state) => state.setWalletState);
  const notify = useNotificationStore((state) => state.notify);
  const [unlocking, startUnlocking] = useTransition();

  const isWallet = async () => {
    try {
      const exist =
        useWalletStore.getState().walletExists || (await isWalletStored());
      return exist;
    } catch (error) {
      console.error("Error checking wallet existence:", error);
      throw error;
    }
  };

  const secureFail = async (message: string) => {
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
    { password }: TVerifyPasswordFormData,
    setError: UseFormSetError<TVerifyPasswordFormData>
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

        if (message === "Invalid password") {
          setError("password", { message });
        } else {
          await secureFail(message);
        }
      }
    });
  };

  return {
    isWallet,
    unlockWallet,
    unlocking,
  };
};

export default useWallet;
