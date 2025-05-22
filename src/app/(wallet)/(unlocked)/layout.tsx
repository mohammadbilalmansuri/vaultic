"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/stores";
import { IChildren } from "@/types";
import { PageShell } from "@/components/shells";

const UnlockedLayout = ({ children }: IChildren) => {
  const router = useRouter();
  const walletStatus = useWalletStore((state) => state.walletStatus);
  const authenticated = useWalletStore((state) => state.authenticated);

  useEffect(() => {
    if (walletStatus === "ready" && authenticated) {
      router.replace("/dashboard");
    }
  }, []);

  if (walletStatus === "checking") return null;

  return <PageShell>{children}</PageShell>;
};

export default UnlockedLayout;
