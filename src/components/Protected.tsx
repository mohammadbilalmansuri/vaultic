"use client";
import { ReactNode, useEffect } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Button, PasswordInput, Loader } from "@/components/ui";
import {
  verifyPasswordSchema,
  VerifyPasswordFormData,
} from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useAuth } from "@/hooks";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { useWallet } from "@/hooks";

const Protected = ({ children }: { children: ReactNode }) => {
  const {
    checking,
    error,
    authenticated,
    handlePasswordSubmit,
    checkUser,
    IS_DEV,
  } = useAuth();
  const pathname = usePathname();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyPasswordFormData>({
    resolver: zodResolver(verifyPasswordSchema),
    mode: "onChange",
  });
  const mnemonic = useUserStore((state) => state.mnemonic);
  const { loadWallets } = useWallet();

  useEffect(() => {
    checkUser(pathname);
  }, [pathname]);

  useEffect(() => {
    if (mnemonic) loadWallets();
  }, [mnemonic]);

  const renderFormError = () => {
    const errorMessage = errors.password?.message || error;
    return errorMessage ? (
      <p className="text-yellow-500 text-sm">{errorMessage}</p>
    ) : null;
  };

  if (checking) return <Loader />;

  if (!authenticated && !IS_DEV) {
    return (
      <motion.form
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        exit={{ scale: 0.8, opacity: 0 }}
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
          className="border-b hover:border-teal-500 hover:text-teal-500 transition-all duration-200"
        >
          Forgot Password
        </Link>
      </motion.form>
    );
  }

  return <>{children}</>;
};

export default Protected;
