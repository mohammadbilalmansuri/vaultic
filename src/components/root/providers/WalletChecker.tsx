"use client";
import { useEffect } from "react";
import { Children } from "@/types";
import { useWalletStore } from "@/stores";
import { useWallet } from "@/hooks";
import { Loading } from "@/components/shared";

const WalletChecker = ({ children }: Children) => {
  const { checkWalletExists } = useWallet();
  const walletStatus = useWalletStore((state) => state.walletStatus);

  useEffect(() => {
    (async () => await checkWalletExists())();
  }, []);

  if (walletStatus === "checking") return <Loading />;

  return children;
};

export default WalletChecker;
