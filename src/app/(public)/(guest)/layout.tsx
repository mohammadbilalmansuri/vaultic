"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IChildren } from "@/types";
import { useWalletStore } from "@/stores";
import { PageShell } from "@/components/shells";
import { Loading } from "@/components/ui";

const GuestLayout = ({ children }: IChildren) => {
  const router = useRouter();
  const walletStatus = useWalletStore((state) => state.walletStatus);
  const suppressRedirect = useWalletStore((state) => state.suppressRedirect);
  const walletExists = useWalletStore((state) => state.walletExists);

  useEffect(() => {
    if (walletStatus !== "ready" || suppressRedirect) return;
    if (walletExists) router.replace("/dashboard");
  }, []);

  if (walletStatus === "checking" || (walletExists && !suppressRedirect)) {
    return <Loading />;
  }

  return <PageShell>{children}</PageShell>;
};

export default GuestLayout;
