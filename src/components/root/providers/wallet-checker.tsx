"use client";
import { useEffect } from "react";
import type { Children } from "@/types";
import { useWalletStatus } from "@/stores";
import { useWalletAuth } from "@/hooks";
import { Loading } from "@/components/shared";

const WalletChecker = ({ children }: Children) => {
  const { checkWalletExists } = useWalletAuth();
  const walletStatus = useWalletStatus();

  useEffect(() => {
    (async () => await checkWalletExists())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (walletStatus === "checking") return <Loading />;

  return children;
};

export default WalletChecker;
