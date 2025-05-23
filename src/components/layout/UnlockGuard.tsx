"use client";
import { IChildren } from "@/types";
import { useWalletStore } from "@/stores";
import { Loading } from "../ui";
import { PageShell } from "../shells";
import UnlockForm from "./UnlockForm";

const UnlockGuard = ({ children }: IChildren) => {
  const walletStatus = useWalletStore((state) => state.walletStatus);
  const authenticated = useWalletStore((state) => state.authenticated);

  if (walletStatus === "checking") return <Loading />;

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
