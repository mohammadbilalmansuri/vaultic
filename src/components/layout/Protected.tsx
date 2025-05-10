"use client";
import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import useUserStore from "@/stores/userStore";
import { Loader } from "@/components/ui";
import getRouteCategory from "@/utils/getRouteCategory";
import UnlockForm from "./UnlockForm";

const Protected = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const routeCategory = getRouteCategory(pathname);
  const { checkUser, checking } = useAuth();
  const userExists = useUserStore((state) => state.userExists);
  const authenticated = useUserStore((state) => state.authenticated);

  useEffect(() => {
    checkUser(routeCategory);
  }, [pathname]);

  if (checking) return <Loader />;

  if (
    userExists &&
    !authenticated &&
    (routeCategory === "authProtected" || routeCategory === "semiProtected")
  ) {
    return <UnlockForm />;
  }

  return <>{children}</>;
};

export default Protected;
