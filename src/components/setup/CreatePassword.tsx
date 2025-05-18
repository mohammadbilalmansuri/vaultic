"use client";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormError, PasswordInput } from "@/components/ui";
import SetupProgress from "./SetupProgress";
import {
  CreatePasswordSchema,
  TCreatePasswordFormData,
} from "@/utils/validations";
import { useWalletStore } from "@/stores";
import { IS_DEV, DEV_PASSWORD } from "@/constants";
import cn from "@/utils/cn";
import { scaleUpAnimation } from "@/utils/animations";
import { TSetupSetStep } from "@/types";

const CreatePassword = ({ setStep }: { setStep: TSetupSetStep }) => {
  const setWalletState = useWalletStore((state) => state.setWalletState);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TCreatePasswordFormData>({
    resolver: zodResolver(CreatePasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: IS_DEV ? DEV_PASSWORD : "",
      confirmPassword: IS_DEV ? DEV_PASSWORD : "",
    },
  });

  const handleCreatePassword = ({ password }: TCreatePasswordFormData) => {
    setWalletState({ password });
    setStep(3);
  };

  return (
    <motion.div {...scaleUpAnimation()} className="setup-box gap-0">
      <SetupProgress step={2} back={() => setStep(1)} />

      <div className="p-6 w-full flex flex-col items-center gap-3">
        <h2>Create Password</h2>
        <p>
          Your password must be at least 8 characters and is used to unlock
          Vaultic on this device. It can't be recovered or reset, so make sure
          to remember it and keep it secure.
        </p>

        <form
          onSubmit={handleSubmit(handleCreatePassword)}
          className="w-full flex flex-col gap-4 mt-3"
        >
          <PasswordInput {...register("password")} />
          <PasswordInput
            {...register("confirmPassword")}
            placeholder="Confirm Password"
          />
          <Button
            type="submit"
            className={cn("w-full", {
              "opacity-60 pointer-events-none": !isValid,
            })}
            disabled={!isValid}
          >
            Continue
          </Button>
          <FormError errors={errors} className="mt-1.5" />
        </form>
      </div>
    </motion.div>
  );
};

export default CreatePassword;
