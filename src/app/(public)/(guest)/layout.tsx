"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Children } from "@/types";
import { useWalletStore } from "@/stores";
import { PageLayout } from "@/components/layouts";
import { Loading } from "@/components/shared";

const GuestLayout = ({ children }: Children) => {
  const router = useRouter();
  const walletStatus = useWalletStore((state) => state.walletStatus);
  const suppressRedirect = useWalletStore((state) => state.suppressRedirect);
  const walletExists = useWalletStore((state) => state.walletExists);

  useEffect(() => {
    if (walletStatus !== "ready" || suppressRedirect) return;
    if (walletExists) router.replace("/dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (walletStatus === "checking" || (walletExists && !suppressRedirect)) {
    return <Loading />;
  }

  return <PageLayout>{children}</PageLayout>;
};

export default GuestLayout;
