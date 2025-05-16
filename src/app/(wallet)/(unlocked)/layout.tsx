"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/stores";

export default function UnlockedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const walletExists = useWalletStore((s) => !!s.mnemonic); // optional stronger check
  const authenticated = useWalletStore((s) => s.authenticated);

  useEffect(() => {
    if (authenticated) {
      router.replace("/dashboard");
    }
  }, [authenticated]);

  return <>{children}</>;
}
