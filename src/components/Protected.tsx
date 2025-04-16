"use client";
import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import useUserStore from "@/stores/userStore";
import { useAuth } from "@/hooks";
import { Loader, Button, PasswordInput } from "@/components/ui";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import {
  verifyPasswordSchema,
  VerifyPasswordFormData,
} from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { DEV_PASSWORD, IS_DEV } from "@/constants";
import cn from "@/utils/cn";

const Protected = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const { checkUser, checking, authenticateWithPassword, authenticating } =
    useAuth();

  const userExists = useUserStore((state) => state.userExists);
  const authenticated = useUserStore((state) => state.authenticated);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<VerifyPasswordFormData>({
    resolver: zodResolver(verifyPasswordSchema),
    mode: "onChange",
    defaultValues: { password: IS_DEV ? DEV_PASSWORD : "" },
  });

  useEffect(() => {
    checkUser(pathname);
  }, [pathname]);

  if (checking) {
    return <Loader />;
  }

  if (userExists && !authenticated) {
    return (
      <motion.form
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="box"
        onSubmit={handleSubmit((data: VerifyPasswordFormData) => {
          authenticateWithPassword(data, setError, clearErrors);
        })}
      >
        <h1 className="-mt-1">Enter Your Password</h1>

        <PasswordInput {...register("password")} />

        {errors.password?.message && (
          <p className="text-yellow-500 text-sm">{errors.password.message}</p>
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
