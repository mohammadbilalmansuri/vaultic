"use client";
import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuth from "@/hooks/useAuth";
import useUserStore from "@/stores/userStore";
import {
  verifyPasswordSchema,
  TVerifyPasswordFormData,
} from "@/utils/validations";
import { Button, Loader, PasswordInput } from "@/components/ui";
import { IS_DEV, DEV_PASSWORD } from "@/constants";
import getRouteCategory from "@/utils/getRouteCategory";
import cn from "@/utils/cn";

const Protected = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const routeCategory = getRouteCategory(pathname);

  const { checkUser, checking, authenticateWithPassword, authenticating } =
    useAuth();

  const userExists = useUserStore((state) => state.userExists);
  const authenticated = useUserStore((state) => state.authenticated);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<TVerifyPasswordFormData>({
    resolver: zodResolver(verifyPasswordSchema),
    mode: "onChange",
    defaultValues: { password: IS_DEV ? DEV_PASSWORD : "" },
  });

  useEffect(() => {
    checkUser(routeCategory);
  }, [pathname]);

  if (checking) return <Loader />;

  if (
    userExists &&
    !authenticated &&
    (routeCategory === "authProtected" || routeCategory === "semiProtected")
  ) {
    return (
      <motion.form
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="box"
        onSubmit={handleSubmit((data) =>
          authenticateWithPassword(data, setError)
        )}
      >
        <h1 className="-mt-1">Enter Your Password</h1>

        <PasswordInput {...register("password")} />

        {errors.password?.message && (
          <p className="text-yellow-500">{errors.password.message}</p>
        )}

        <Button
          className={cn("w-full", {
            "opacity-60 pointer-events-none": !isValid,
          })}
          type="submit"
          disabled={!isValid}
        >
          {authenticating ? <Loader size="sm" color="black" /> : "Unlock"}
        </Button>

        <Link
          href="/forgot-password"
          className="leading-none hover:heading-color transition-all duration-300"
        >
          Forgot Password
        </Link>
      </motion.form>
    );
  }

  return <>{children}</>;
};

export default Protected;
