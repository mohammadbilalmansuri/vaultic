"use client";
import { useTransition } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scaleUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { VerifyPasswordSchema, VerifyPasswordForm } from "@/utils/validations";
import { useWalletAuth } from "@/hooks";
import { Logo } from "../icons";
import { Button, FormError, Loader, PasswordInput } from "../ui";

const UnlockForm = () => {
  const { unlockWallet } = useWalletAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<VerifyPasswordForm>({
    resolver: zodResolver(VerifyPasswordSchema),
    mode: "onChange",
    defaultValues: { password: "" },
  });

  const [unlocking, startUnlocking] = useTransition();
  const handleUnlock = (data: VerifyPasswordForm) => {
    startUnlocking(async () => await unlockWallet(data, setError));
  };

  return (
    <motion.div
      aria-label="Unlock Wallet"
      className="box without-progress"
      {...scaleUpAnimation()}
    >
      <Logo className="icon-lg text-teal-500" aria-hidden="true" />
      <h1>Enter Your Password</h1>

      <form
        onSubmit={handleSubmit(handleUnlock)}
        className="w-full flex flex-col sm:gap-4 gap-3 -mt-0.5"
        aria-label="Unlock wallet form"
      >
        <PasswordInput {...register("password")} autoFocus />
        <Button
          type="submit"
          className={cn("w-full mt-0.5", {
            "opacity-60 pointer-events-none": !isValid,
          })}
          disabled={!isValid || unlocking}
        >
          {unlocking ? <Loader size="sm" color="current" /> : "Unlock"}
        </Button>
        <FormError errors={errors} className="mt-2 -mb-2" />
      </form>

      <Link href="/forgot-password" className="link">
        Forgot Password
      </Link>
    </motion.div>
  );
};

export default UnlockForm;
