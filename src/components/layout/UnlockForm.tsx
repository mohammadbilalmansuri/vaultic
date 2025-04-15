"use client";
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
import { DEV_PASSWORD, IS_DEV } from "@/constants";
import cn from "@/utils/cn";

const UnlockForm = () => {
  const { authenticateWithPassword, authenticating } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<VerifyPasswordFormData>({
    resolver: zodResolver(verifyPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: IS_DEV ? DEV_PASSWORD : "",
    },
  });

  const onSubmit = (data: VerifyPasswordFormData) => {
    authenticateWithPassword(data, setError, clearErrors);
  };

  return (
    <motion.form
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="box"
      onSubmit={handleSubmit(onSubmit)}
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
};

export default UnlockForm;
