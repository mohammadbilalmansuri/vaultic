"use client";
import { useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStorage } from "@/hooks";

const protectedRoutes = ["/dashboard", "/profile", "/settings"];

const Protected = ({ children }: { children: ReactNode }) => {
  const { isUser } = useStorage();
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    (async () => {
      const isUserExists = await isUser();
      const isProtectedRoute = protectedRoutes.includes(pathname);

      if (isUserExists && pathname === "/") {
        router.replace("/dashboard");
      } else if (!isUserExists && isProtectedRoute) {
        router.replace("/");
      } else {
        setChecked(true);
      }
    })();
  }, [isUser, pathname, router]);

  if (!checked) return null;

  return <>{children}</>;
};

export default Protected;
