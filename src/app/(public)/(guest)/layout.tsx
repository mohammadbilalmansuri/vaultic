"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Children } from "@/types";
import {
  useSuppressRedirect,
  useWalletExists,
  useWalletStatus,
} from "@/stores";
import { PageLayout } from "@/components/layouts";
import { Loading } from "@/components/shared";

const GuestLayout = ({ children }: Children) => {
  const router = useRouter();
  const walletStatus = useWalletStatus();
  const suppressRedirect = useSuppressRedirect();
  const walletExists = useWalletExists();

  useEffect(() => {
    if (walletStatus !== "ready" || suppressRedirect) return;
    if (walletExists) router.replace("/dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (walletStatus === "checking" || (walletExists && !suppressRedirect)) {
    return <Loading />;
  }

  return <PageLayout>{children}</PageLayout>;
};

export default GuestLayout;
