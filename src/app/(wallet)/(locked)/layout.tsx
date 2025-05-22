"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/stores";
import { LayoutProps } from "@/types";

const LockedLayout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { authenticated, walletStatus } = useWalletStore();

  useEffect(() => {
    if (walletStatus === "ready" && !authenticated) {
      router.replace("/unlock");
    }
  }, []);

  if (walletStatus === "checking") return null;

  return children;
};

export default LockedLayout;
