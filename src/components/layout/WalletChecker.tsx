"use client";
import { useEffect } from "react";
import { LayoutProps } from "@/types";
import { useWallet } from "@/hooks";
import useWalletStore from "@/stores/walletStore";

const WalletChecker = ({ children }: LayoutProps) => {
  const { checkWalletExists } = useWallet();
  const checkingWallet = useWalletStore((state) => state.checkingWallet);

  useEffect(() => {
    checkWalletExists();
  }, []);

  if (checkingWallet) return null;

  return children;
};

export default WalletChecker;
