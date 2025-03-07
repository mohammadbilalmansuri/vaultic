"use client";
import { useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Button, PasswordInput } from "@/components/ui";
import {
  verifyPasswordSchema,
  VerifyPasswordFormData,
} from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/stores/userStore";
import { useStorage } from "@/hooks";
import Link from "next/link";

const protectedRoutes = new Set(["/dashboard", "/profile", "/settings"]);

const Protected = ({ children }: { children: ReactNode }) => {
  const { isUser, loadUser } = useStorage();
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const authenticated = useUserStore((state) => state.authenticated);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyPasswordFormData>({
    resolver: zodResolver(verifyPasswordSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const checkUser = async () => {
      const isUserExists = await isUser();
      if (isUserExists && pathname === "/") {
        router.replace("/dashboard");
      } else if (!isUserExists && protectedRoutes.has(pathname)) {
        router.replace("/");
      } else {
        setChecked(true);
      }
    };
    checkUser();
  }, [isUser, pathname, router]);

  const onSubmit = async ({
    password: inputPassword,
  }: VerifyPasswordFormData) => {
    try {
      await loadUser(inputPassword);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError("An unknown error occurred");
      setTimeout(() => setError(""), 3000);
    }
  };

  const renderFormError = () => {
    const errorMessage = errors.password?.message || error;

    return errorMessage ? (
      <p className="text-yellow-500 text-sm">{errorMessage}</p>
    ) : null;
  };

  if (!checked) return null;

  if (protectedRoutes.has(pathname) && !authenticated) {
    return (
      <motion.form
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="box"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="-mt-1">Enter Your Password</h1>

        <PasswordInput {...register("password")} />

        {renderFormError()}

        <Button className="w-full" type="submit">
          Unlock
        </Button>

        <Link
          href="/forgot-password"
          className="border-b hover:border-teal-500 hover:text-teal transition-all duration-200"
        >
          Forgot Password
        </Link>
      </motion.form>
    );
  }

  return <>{children}</>;
};

export default Protected;
