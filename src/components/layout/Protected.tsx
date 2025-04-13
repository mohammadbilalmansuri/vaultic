"use client";
import { ReactNode, useEffect } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Button, PasswordInput, Loader } from "@/components/common";
import {
  verifyPasswordSchema,
  VerifyPasswordFormData,
} from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useAuth } from "@/hooks";
import { usePathname } from "next/navigation";
import useUserStore from "@/stores/userStore";
import { IS_DEV } from "@/constants";

const Protected = ({ children }: { children: ReactNode }) => {
  const { checking, error, checkUser, handlePasswordSubmit } = useAuth();
  const authenticated = useUserStore((state) => state.authenticated);
  const pathname = usePathname();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyPasswordFormData>({
    resolver: zodResolver(verifyPasswordSchema),
    mode: "onChange",
  });

  useEffect(() => {
    (async () => {
      try {
        await checkUser(pathname);
      } catch (error) {
        console.error("Error checking user:", error);
      }
    })();
  }, [pathname]);

  const renderFormError = () => {
    const errorMessage = errors.password?.message || error;
    return errorMessage ? (
      <p className="text-yellow-500 text-sm">{errorMessage}</p>
    ) : null;
  };

  if (checking) {
    return <Loader />;
  }

  if (!authenticated && !IS_DEV) {
    return (
      <motion.form
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="box"
        onSubmit={handleSubmit(handlePasswordSubmit)}
      >
        <h1 className="-mt-1">Enter Your Password</h1>
        <PasswordInput {...register("password")} />
        {renderFormError()}
        <Button className="w-full" type="submit">
          Unlock
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
