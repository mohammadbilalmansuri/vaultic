"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks";
import {
  verifyPasswordSchema,
  TVerifyPasswordFormData,
} from "@/utils/validations";
import { Button, FormError, Loader, PasswordInput } from "@/components/ui";
import { IS_DEV, DEV_PASSWORD } from "@/constants";
import { scaleUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";

const UnlockForm = () => {
  const { authenticateWithPassword, authenticating } = useAuth();
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

  return (
    <motion.form
      {...scaleUpAnimation()}
      className="box"
      onSubmit={handleSubmit((data) =>
        authenticateWithPassword(data, setError)
      )}
    >
      <h1 className="box-heading -mt-2 mb-2">Enter Your Password</h1>
      <PasswordInput {...register("password")} />
      <FormError errors={errors} />
      <Button
        type="submit"
        className={cn("w-full", {
          "opacity-60 pointer-events-none": !isValid,
        })}
        disabled={!isValid || authenticating}
      >
        {authenticating ? <Loader size="sm" color="black" /> : "Unlock"}
      </Button>
      <Link
        href="/forgot-password"
        className="leading-tight -mb-1 mt-3 border-b border-transparent hover:border-current hover:heading-color transition-colors duration-300"
      >
        Forgot Password
      </Link>
    </motion.form>
  );
};

export default UnlockForm;
