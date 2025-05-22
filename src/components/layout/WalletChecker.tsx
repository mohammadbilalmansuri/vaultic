"use client";
import { useEffect } from "react";
import { IChildren } from "@/types";
import useWalletStore from "@/stores/walletStore";
import { useWallet } from "@/hooks";

const WalletChecker = ({ children }: IChildren) => {
  const { checkWalletExists } = useWallet();
  const walletStatus = useWalletStore((state) => state.walletStatus);

  useEffect(() => {
    checkWalletExists();
  }, []);

  if (walletStatus === "checking") return null;

  return children;
};

export default WalletChecker;
