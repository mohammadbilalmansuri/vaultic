"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useWalletStore from "@/stores/walletStore";
import { LayoutProps } from "@/types";
import { PublicLayout } from "@/components/layout";

const GuestLayout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const walletExists = useWalletStore((state) => state.walletExists);
  const walletStatus = useWalletStore((state) => state.walletStatus);
  const suppressRedirect = useWalletStore((state) => state.suppressRedirect);

  useEffect(() => {
    if (walletStatus === "ready" && walletExists && !suppressRedirect) {
      router.replace("/dashboard");
    }
  }, []);

  if (walletStatus === "checking" || (walletExists && !suppressRedirect)) {
    return null;
  }

  return <PublicLayout>{children}</PublicLayout>;
};

export default GuestLayout;
