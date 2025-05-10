"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useStorage, useWallet } from "@/hooks";
import useUserStore from "@/stores/userStore";
import useNotificationStore from "@/stores/notificationStore";
import { TVerifyPasswordFormData } from "@/utils/validations";
import { UseFormSetError } from "react-hook-form";
import delay from "@/utils/delay";
import { TRouteCategory } from "@/types";

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
        message: `${message}. For your safety, we'll take you back to the start.`,
      });

      await delay(4000);
      await removeUser();
      router.replace("/");
    } catch (error) {
      notify({
        type: "error",
        message:
          "We couldn't reset your data automatically. Please clear this site's stored data from your browser settings and refresh the page to continue safely.",
      });
    }
  };

  const checkUser = (routeCategory: TRouteCategory) => {
    startChecking(async () => {
      try {
        let exists = useUserStore.getState().userExists;
        if (!exists) {
          exists = await isUser();
          setUserState({ userExists: exists });
        }

        const allowed =
          routeCategory === "public" ||
          routeCategory === "semiProtected" ||
          (routeCategory === "authProtected" && exists) ||
          (routeCategory === "guestOnly" && !exists) ||
          (routeCategory === "authOnly" && exists);

        if (!allowed) {
          router.replace(exists ? "/dashboard" : "/");
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
    setError: UseFormSetError<TVerifyPasswordFormData>
  ) => {
    startAuthenticating(async () => {
      try {
        await loadUser(password);
        await loadWallets();
        setUserState({ authenticated: true });
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
    checkUser,
    checking,
    authenticateWithPassword,
    authenticating,
  };
};

export default useAuth;
