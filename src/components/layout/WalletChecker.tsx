"use client";
import { useEffect } from "react";
import { IChildren } from "@/types";
import { useWalletStore } from "@/stores";
import { useWallet } from "@/hooks";
import { Loading } from "../ui";

const WalletChecker = ({ children }: IChildren) => {
  const { checkWalletExists } = useWallet();
  const walletStatus = useWalletStore((state) => state.walletStatus);

  useEffect(() => {
    (async () => await checkWalletExists())();
  }, []);

  if (walletStatus === "checking") return <Loading />;

  return children;
};

export default WalletChecker;
