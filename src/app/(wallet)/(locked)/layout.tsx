"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Children } from "@/types";
import {
  useAuthenticated,
  useSuppressRedirect,
  useWalletExists,
  useWalletStatus,
} from "@/stores";
import { useNetworkStatus } from "@/hooks";
import { PageLayout, DashboardLayout } from "@/components/layouts";
import { UnlockForm, OfflineView } from "@/components/root";
import { Loading } from "@/components/shared";

const LockedLayout = ({ children }: Children) => {
  const router = useRouter();
  const isOnline = useNetworkStatus();

  const walletStatus = useWalletStatus();
  const suppressRedirect = useSuppressRedirect();
  const walletExists = useWalletExists();
  const authenticated = useAuthenticated();

  useEffect(() => {
    if (walletStatus !== "ready" || suppressRedirect) return;
    if (!walletExists) router.replace("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (walletStatus === "checking" || (!walletExists && !suppressRedirect)) {
    return <Loading />;
  }

  if (!isOnline) {
    return (
      <PageLayout>
        <OfflineView />
      </PageLayout>
    );
  }

  if (walletExists && !authenticated) {
    return (
      <PageLayout>
        <UnlockForm />
      </PageLayout>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default LockedLayout;
