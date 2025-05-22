"use client";
import { useTransition } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWallet } from "@/hooks";
import { VerifyPasswordSchema, TVerifyPasswordForm } from "@/utils/validations";
import { Button, FormError, Loader, PasswordInput } from "@/components/ui";
import { Logo } from "@/components/ui/icons";
import { IS_DEV, DEV_PASSWORD } from "@/constants";
import { scaleUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";

const UnlockForm = () => {
  const { unlockWallet } = useWallet();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<TVerifyPasswordForm>({
    resolver: zodResolver(VerifyPasswordSchema),
    mode: "onBlur",
    defaultValues: { password: IS_DEV ? DEV_PASSWORD : "" },
  });

  const [unlocking, startUnlocking] = useTransition();
  const handleUnlock = (data: TVerifyPasswordForm) => {
    startUnlocking(async () => await unlockWallet(data, setError));
  };

  return (
    <motion.form
      {...scaleUpAnimation()}
      className="box p-12"
      onSubmit={handleSubmit(handleUnlock)}
    >
      <Logo className="w-15 text-teal-500" />
      <h2 className="mt-3 mb-1">Enter Your Password</h2>
      <PasswordInput {...register("password")} />
      <Button
        type="submit"
        className={cn("w-full", {
          "opacity-60 pointer-events-none": !isValid,
        })}
        disabled={!isValid || unlocking}
      >
        {unlocking ? <Loader size="sm" color="black" /> : "Unlock"}
      </Button>
      <FormError errors={errors} className="mt-1.5 -mb-2" />
      <Link
        href="/forgot-password"
        className="mt-2 leading-snug border-b border-current hover:heading-color transition-colors duration-300"
      >
        Forgot Password
      </Link>
    </motion.form>
  );
};

export default UnlockForm;
