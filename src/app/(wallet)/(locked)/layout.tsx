"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IChildren } from "@/types";
import { useWalletStore } from "@/stores";
import { useNetworkStatus } from "@/hooks";
import { Loading } from "@/components/ui";
import { PageShell, DashboardShell } from "@/components/shells";
import { UnlockForm, OfflineView } from "@/components/layout";

const LockedLayout = ({ children }: IChildren) => {
  const router = useRouter();
  const walletStatus = useWalletStore((state) => state.walletStatus);
  const suppressRedirect = useWalletStore((state) => state.suppressRedirect);
  const walletExists = useWalletStore((state) => state.walletExists);
  const authenticated = useWalletStore((state) => state.authenticated);
  const isOnline = useNetworkStatus();

  useEffect(() => {
    if (walletStatus !== "ready" || suppressRedirect) return;
    if (!walletExists) router.replace("/");
  }, []);

  if (walletStatus === "checking" || (!walletExists && !suppressRedirect)) {
    return <Loading />;
  }

  if (!isOnline) {
    return (
      <PageShell>
        <OfflineView />
      </PageShell>
    );
  }

  if (walletExists && !authenticated) {
    return (
      <PageShell>
        <UnlockForm />
      </PageShell>
    );
  }

  return <DashboardShell>{children}</DashboardShell>;
};

export default LockedLayout;
