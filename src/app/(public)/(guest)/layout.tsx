"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useWalletStore from "@/stores/walletStore";
import { IChildren } from "@/types";
import { PageShell } from "@/components/shells";

const GuestLayout = ({ children }: IChildren) => {
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

  return <PageShell>{children}</PageShell>;
};

export default GuestLayout;
