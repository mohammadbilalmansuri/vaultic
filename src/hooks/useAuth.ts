"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useStorage, useWallet } from "@/hooks";
import useUserStore from "@/stores/userStore";
import useNotificationStore from "@/stores/notificationStore";
import { TVerifyPasswordFormData } from "@/utils/validations";
import { UseFormSetError, UseFormClearErrors } from "react-hook-form";
import delay from "@/utils/delay";
import { AUTHENTICATED_ROUTES } from "@/constants";

const useAuth = () => {
  const router = useRouter();
  const { isUser, loadUser, removeUser } = useStorage();
  const { loadWallets } = useWallet();

  const setUserState = useUserStore((state) => state.setUserState);
  const notify = useNotificationStore((state) => state.notify);

  const [checking, startChecking] = useTransition();
  const [authenticating, startAuthenticating] = useTransition();

  const secureFail = async (message: string) => {
    try {
      notify({
        type: "error",
        message: `${message}. For your security, we'll return you to the start.`,
      });
      await delay(4000);
      await removeUser();
      router.replace("/");
    } catch (error) {
      notify({
        type: "error",
        message:
          "We couldn't reset your data automatically. Please clear your browser's site data and refresh to continue securely.",
      });
    }
  };

  const checkUser = (pathname: string) => {
    startChecking(async () => {
      try {
        let exists = useUserStore.getState().userExists;

        if (!exists) {
          exists = await isUser();
          setUserState({ userExists: exists });
        }

        if (!exists && AUTHENTICATED_ROUTES.has(pathname) && pathname !== "/") {
          router.replace("/");
        }

        if (exists && pathname === "/") {
          router.replace("/dashboard");
        }
      } catch (error) {
        await secureFail(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      }
    });
  };

  const authenticateWithPassword = (
    { password }: TVerifyPasswordFormData,
    setError: UseFormSetError<TVerifyPasswordFormData>,
    clearErrors: UseFormClearErrors<TVerifyPasswordFormData>
  ) => {
    startAuthenticating(async () => {
      try {
        await loadUser(password);
        await loadWallets();
        setUserState({ authenticated: true });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";

        if (errorMessage === "Invalid password") {
          setError("password", {
            type: "manual",
            message: errorMessage,
          });
          await delay(4000);
          clearErrors("password");
        } else {
          await secureFail(errorMessage);
        }
      }
    });
  };

  return {
    checkUser,
    checking,
    authenticateWithPassword,
    authenticating,
  };
};

export default useAuth;
