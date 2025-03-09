"use client";
import { useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Button, PasswordInput, Loader } from "@/components/ui";
import {
  verifyPasswordSchema,
  VerifyPasswordFormData,
} from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStorage, useWallet } from "@/hooks";
import { useUserStore } from "@/stores/userStore";
import Link from "next/link";

const Protected = ({ children }: { children: ReactNode }) => {
  const { isUser, loadUser } = useStorage();
  const { loadWallets } = useWallet();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const authenticated = useUserStore((state) => state.authenticated);
  const mnemonic = useUserStore((state) => state.mnemonic);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyPasswordFormData>({
    resolver: zodResolver(verifyPasswordSchema),
    mode: "onChange",
  });

  const checkUser = async () => {
    setChecking(true);
    const isUserExists = await isUser().catch((error) => {
      console.log(error);
    });

    if (!isUserExists) {
      if (pathname === "/dashboard") {
        router.replace("/");
        return;
      }
      setChecking(false);
      return;
    }

    try {
      await loadUser("12345678");
    } catch (error) {
      console.log(error);
    }

    if (pathname === "/") {
      router.replace("/dashboard");
      return;
    }
    setChecking(false);
  };

  useEffect(() => {
    checkUser();
  }, [pathname, router]);

  useEffect(() => {
    if (mnemonic) loadWallets();
  }, [mnemonic]);

  const onSubmit = async ({
    password: inputPassword,
  }: VerifyPasswordFormData) => {
    try {
      await loadUser(inputPassword);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      setTimeout(() => setError(""), 3000);
    }
  };

  const renderFormError = () => {
    const errorMessage = errors.password?.message || error;
    return errorMessage ? (
      <p className="text-yellow-500 text-sm">{errorMessage}</p>
    ) : null;
  };

  if (checking) return <Loader />;

  // if (pathname === "/dashboard" && !authenticated) {
  //   return (
  //     <motion.form
  //       initial={{ scale: 0.8, opacity: 0 }}
  //       animate={{ scale: 1, opacity: 1 }}
  //       transition={{ duration: 0.4, ease: "easeInOut" }}
  //       exit={{ scale: 0.8, opacity: 0 }}
  //       className="box"
  //       onSubmit={handleSubmit(onSubmit)}
  //     >
  //       <h1 className="-mt-1">Enter Your Password</h1>
  //       <PasswordInput {...register("password")} />
  //       {renderFormError()}
  //       <Button className="w-full" type="submit">
  //         Unlock
  //       </Button>
  //       <Link
  //         href="/forgot-password"
  //         className="border-b hover:border-teal-500 hover:text-teal-500 transition-all duration-200"
  //       >
  //         Forgot Password
  //       </Link>
  //     </motion.form>
  //   );
  // }

  return <>{children}</>;
};

export default Protected;
