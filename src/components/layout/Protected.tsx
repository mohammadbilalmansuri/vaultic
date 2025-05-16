"use client";
import { useWalletStore } from "@/stores";
import UnlockForm from "./UnlockForm";
import { LayoutProps } from "@/types";

const Protected = ({ children }: LayoutProps) => {
  const authenticated = useWalletStore((state) => state.authenticated);

  if (!authenticated) {
    return <UnlockForm />;
  }

  return <>{children}</>;
};

export default Protected;
