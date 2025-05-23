"use client";
import { useTransition } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VerifyPasswordSchema, TVerifyPasswordForm } from "@/utils/validations";
import { useWallet } from "@/hooks";
import { IS_DEV, DEV_PASSWORD } from "@/constants";
import { Button, FormError, Loader, PasswordInput } from "../ui";
import { Logo } from "../ui/icons";
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
    mode: "onChange",
    defaultValues: { password: IS_DEV ? DEV_PASSWORD : "" },
  });

  const [unlocking, startUnlocking] = useTransition();
  const handleUnlock = (data: TVerifyPasswordForm) => {
    startUnlocking(async () => await unlockWallet(data, setError));
  };

  return (
    <motion.div {...scaleUpAnimation()} className="box p-12">
      <Logo className="w-15 text-teal-500" />
      <h2 className="mt-3">Enter Your Password</h2>

      <form
        onSubmit={handleSubmit(handleUnlock)}
        className="w-full flex flex-col gap-4 mt-1"
      >
        <PasswordInput {...register("password")} autoFocus={true} />
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
      </form>

      <Link
        href="/forgot-password"
        className="mt-2 leading-snug border-b border-current hover:heading-color transition-colors duration-300"
      >
        Forgot Password
      </Link>
    </motion.div>
  );
};

export default UnlockForm;
