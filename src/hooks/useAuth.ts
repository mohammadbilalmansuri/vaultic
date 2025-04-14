import { useState } from "react";
import { useStorage, useWallet } from "@/hooks";
import useUserStore from "@/stores/userStore";
import { VerifyPasswordFormData } from "@/utils/validation";
import { useRouter } from "next/navigation";
import { IS_DEV, DEV_PASSWORD } from "@/constants";
import useNotificationStore from "@/stores/notificationStore";

const AUTHENTICATED_ROUTES = new Set<string>(["/dashboard", "/account"]);

const useAuth = () => {
  const { isUser, loadUser, removeUser } = useStorage();
  const { loadWallets } = useWallet();
  const router = useRouter();
  const notify = useNotificationStore((state) => state.notify);

  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  const checkUser = async (pathname: string) => {
    setChecking(true);
    let redirected = false;

    try {
      const { authenticated } = useUserStore.getState();
      const userExists = authenticated || (await isUser());

      if (
        !userExists &&
        AUTHENTICATED_ROUTES.has(pathname) &&
        pathname !== "/"
      ) {
        router.replace("/");
        redirected = true;
      }

      if (userExists && IS_DEV && !authenticated) {
        await loadUser(DEV_PASSWORD);
        await loadWallets();
      }

      if (userExists && pathname === "/") {
        router.replace("/dashboard");
        redirected = true;
      }
    } catch (error) {
      throw error;
    }

    if (!redirected) setChecking(false);
  };

  const handlePasswordSubmit = async ({ password }: VerifyPasswordFormData) => {
    try {
      await loadUser(password);
      await loadWallets();
    } catch (error) {
      console.error("Error submitting password:", error);

      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      if (errorMessage === "Invalid password") {
        setError(errorMessage);
        await new Promise((resolve) => setTimeout(resolve, 4000));
        setError("");
      } else {
        notify(
          `${errorMessage}. For your security, we'll take you back to the start.`,
          "error"
        );
        await new Promise((resolve) => setTimeout(resolve, 4000));
        await removeUser();
        router.replace("/");
      }
    }
  };

  return {
    checking,
    error,
    checkUser,
    handlePasswordSubmit,
  };
};

export default useAuth;
