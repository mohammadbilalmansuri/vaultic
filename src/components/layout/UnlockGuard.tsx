"use client";
import { IChildren } from "@/types";
import { useWalletStore } from "@/stores";
import { PageShell } from "@/components/shells";
import UnlockForm from "./UnlockForm";

const UnlockGuard = ({ children }: IChildren) => {
  const walletStatus = useWalletStore((state) => state.walletStatus);
  const authenticated = useWalletStore((state) => state.authenticated);

  if (walletStatus === "checking") return null;

  if (!authenticated) {
    return (
      <PageShell>
        <UnlockForm />
      </PageShell>
    );
  }

  return children;
};

export default UnlockGuard;
