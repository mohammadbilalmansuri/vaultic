"use client";
import { useWalletStore } from "@/stores";
import PublicLayout from "./PublicLayout";
import UnlockForm from "./UnlockForm";
import { LayoutProps } from "@/types";

const UnlockGuard = ({ children }: LayoutProps) => {
  const walletStatus = useWalletStore((state) => state.walletStatus);
  const authenticated = useWalletStore((state) => state.authenticated);

  if (walletStatus === "checking") return null;

  if (!authenticated) {
    return (
      <PublicLayout>
        <UnlockForm />
      </PublicLayout>
    );
  }

  return children;
};

export default UnlockGuard;
