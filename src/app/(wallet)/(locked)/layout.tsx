"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/stores";

export default function LockedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const authenticated = useWalletStore((s) => s.authenticated);

  useEffect(() => {
    if (!authenticated) {
      router.replace("/unlock");
    }
  }, [authenticated]);

  return <>{children}</>;
}
