"use client";
import { useEffect } from "react";
import type { Children } from "@/types";
import { useWalletStore } from "@/stores";
import { useWallet } from "@/hooks";
import { Loading } from "@/components/shared";

const WalletChecker = ({ children }: Children) => {
  const { checkWalletExists } = useWallet();
  const walletStatus = useWalletStore((state) => state.walletStatus);

  useEffect(() => {
    (async () => await checkWalletExists())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (walletStatus === "checking") return <Loading />;

  return children;
};

export default WalletChecker;
