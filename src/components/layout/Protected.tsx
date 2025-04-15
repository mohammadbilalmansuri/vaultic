"use client";
import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import useUserStore from "@/stores/userStore";
import { useAuth } from "@/hooks";
import { Loader } from "@/components/common";
import UnlockForm from "./UnlockForm";

const Protected = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const { checkUser, checking } = useAuth();
  const userExists = useUserStore((state) => state.userExists);
  const authenticated = useUserStore((state) => state.authenticated);

  useEffect(() => {
    checkUser(pathname);
  }, [pathname]);

  if (checking) {
    return <Loader />;
  }

  if (userExists && !authenticated) {
    return <UnlockForm />;
  }

  return <>{children}</>;
};

export default Protected;
