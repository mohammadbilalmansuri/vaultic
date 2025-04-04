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
    try {
      const userExists = await isUser();

      if (!userExists) {
        if (AUTHENTICATED_ROUTES.has(pathname) && pathname !== "/") {
          router.replace("/");
          return;
        }
      } else {
        if (IS_DEV && !authenticated) {
          await loadUser(DEV_PASSWORD);
          await loadWallets();
        }

        if (pathname === "/") {
          router.replace("/dashboard");
          return;
        }
      }
    } catch (error) {
      console.error("Error checking user:", error);
    }
    setChecking(false);
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
