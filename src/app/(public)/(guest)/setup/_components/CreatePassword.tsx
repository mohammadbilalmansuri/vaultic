"use client";
import { JSX } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IS_DEV, DEV_PASSWORD } from "@/config";
import { TSetupSetStep } from "@/types";
import { useWalletStore } from "@/stores";
import { scaleUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { CreatePasswordSchema, TCreatePasswordForm } from "@/utils/validations";
import { Button, FormError, PasswordInput } from "@/components/ui";

const CreatePassword = ({
  setStep,
  StepProgress,
}: {
  setStep: TSetupSetStep;
  StepProgress: JSX.Element;
}) => {
  const setWalletState = useWalletStore((state) => state.setWalletState);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TCreatePasswordForm>({
    resolver: zodResolver(CreatePasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: IS_DEV ? DEV_PASSWORD : "",
      confirmPassword: IS_DEV ? DEV_PASSWORD : "",
    },
  });

  const handleCreatePassword = ({ password }: TCreatePasswordForm) => {
    setWalletState({ password });
    setStep(3);
  };

  return (
    <motion.div
      key="create-password"
      {...scaleUpAnimation({ duration: 0.15 })}
      className="box gap-0"
    >
      {StepProgress}

      <div className="p-6 w-full flex flex-col items-center gap-3">
        <h2>Create password</h2>
        <p>
          Your password must be at least 8 characters and is used to unlock
          Vaultic on this device. It can’t be recovered or reset, so make sure
          to remember it and keep it secure.
        </p>

        <form
          onSubmit={handleSubmit(handleCreatePassword)}
          className="w-full flex flex-col gap-4 mt-3"
        >
          <PasswordInput {...register("password")} autoFocus />
          <PasswordInput
            {...register("confirmPassword")}
            placeholder="Confirm Password"
          />
          <Button
            type="submit"
            className={cn("w-full mt-px", {
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
