"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Children } from "@/types";
import { useWalletStore } from "@/stores";
import { useNetworkStatus } from "@/hooks";
import { PageLayout, DashboardLayout } from "@/components/layouts";
import { UnlockForm, OfflineView } from "@/components/root";
import { Loading } from "@/components/shared";

const LockedLayout = ({ children }: Children) => {
  const router = useRouter();
  const isOnline = useNetworkStatus();

  const walletStatus = useWalletStore((state) => state.walletStatus);
  const suppressRedirect = useWalletStore((state) => state.suppressRedirect);
  const walletExists = useWalletStore((state) => state.walletExists);
  const authenticated = useWalletStore((state) => state.authenticated);

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
