"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/stores";
import { LayoutProps } from "@/types";

const UnlockedLayout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const walletStatus = useWalletStore((state) => state.walletStatus);
  const authenticated = useWalletStore((state) => state.authenticated);

  useEffect(() => {
    if (walletStatus === "ready" && authenticated) {
      router.replace("/dashboard");
    }
  }, []);

  if (walletStatus === "checking") return null;

  return <>{children}</>;
};

export default UnlockedLayout;
