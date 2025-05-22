"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/stores";
import { IChildren } from "@/types";

const WalletLayout = ({ children }: IChildren) => {
  const router = useRouter();
  const walletExists = useWalletStore((state) => state.walletExists);
  const walletStatus = useWalletStore((state) => state.walletStatus);

  useEffect(() => {
    if (walletStatus === "ready" && !walletExists) {
      router.replace("/");
    }
  }, []);

  if (walletStatus === "checking" || !walletExists) return null;

  return children;
};

export default WalletLayout;
