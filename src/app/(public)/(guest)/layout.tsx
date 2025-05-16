"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks";
import { LayoutProps } from "@/types";

const GuestLayout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { isWallet } = useWallet();

  useEffect(() => {
    (async () => {
      const walletExists = await isWallet();
      if (walletExists) router.replace("/unlock");
    })();
  }, []);

  return <>{children}</>;
};

export default GuestLayout;
