import { useState } from "react";
import { useStorage, useWallet } from "@/hooks";
import { useUserStore } from "@/stores/userStore";
import { VerifyPasswordFormData } from "@/utils/validation";
import { useRouter } from "next/navigation";

const AUTHENTICATED_ROUTES = new Set(["/dashboard", "/account"]);
const IS_DEV = process.env.NODE_ENV === "development";
const DEV_PASSWORD = "12345678";

const useAuth = () => {
  const { isUser, loadUser } = useStorage();
  const { loadWallets } = useWallet();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const authenticated = useUserStore((state) => state.authenticated);
  const router = useRouter();

  const checkUser = async (pathname: string) => {
    setChecking(true);
    let redirected = false;

    try {
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
      console.error("Error checking user:", error);
    }

    if (!redirected) {
      setChecking(false);
    }
  };

  const handlePasswordSubmit = async ({ password }: VerifyPasswordFormData) => {
    try {
      await loadUser(password);
      await loadWallets();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      setTimeout(() => setError(""), 3000);
    }
  };

  return {
    checking,
    error,
    setError,
    authenticated,
    handlePasswordSubmit,
    checkUser,
    IS_DEV,
  };
};

export default useAuth;
