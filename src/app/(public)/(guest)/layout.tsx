"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks";
import { LayoutProps } from "@/types";

const GuestLayout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { walletExists } = useWallet();

  useEffect(() => {
    (async () => {
      const isWallet = await walletExists();
      if (isWallet) router.replace("/unlock");
    })();
  }, []);

  return <>{children}</>;
};

export default GuestLayout;
