import { useState } from "react";
import { useStorage, useWallet } from "@/hooks";
import { useUserStore } from "@/stores/userStore";
import { VerifyPasswordFormData } from "@/utils/validation";
import { useRouter } from "next/navigation";

const AUTHENTICATED_ROUTES = new Set(["/wallets", "/send", "/account"]);
const IS_DEV = process.env.NODE_ENV === "development";
const DEV_PASSWORD = "12345678";

const useAuth = () => {
  const { isUser, loadUser } = useStorage();
  const { loadWallets } = useWallet();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const authenticated = useUserStore((state) => state.authenticated);
  const mnemonic = useUserStore((state) => state.mnemonic);
  const router = useRouter();

  const checkUser = async (pathname: string) => {
    setChecking(true);
    try {
      const isUserExists = await isUser();
      if (!isUserExists) {
        if (AUTHENTICATED_ROUTES.has(pathname) && pathname !== "/") {
          router.replace("/");
        }
        return;
      }

      if (IS_DEV) {
        await loadUser(DEV_PASSWORD);
      }

      if (pathname === "/") {
        router.replace("/wallets");
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setChecking(false);
    }
  };

  const handlePasswordSubmit = async ({ password }: VerifyPasswordFormData) => {
    try {
      await loadUser(password);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
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
