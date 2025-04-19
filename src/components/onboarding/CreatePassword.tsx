"use client";
import { Dispatch, SetStateAction, useTransition } from "react";
import { TOnboardingStep } from "@/types";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Button, Loader, PasswordInput } from "@/components/ui";
import {
  CreatePasswordSchema,
  TCreatePasswordFormData,
} from "@/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import useUserStore from "@/stores/userStore";
import { useStorage } from "@/hooks";
import useNotificationStore from "@/stores/notificationStore";
import { IS_DEV, DEV_PASSWORD } from "@/constants";
import cn from "@/utils/cn";

type CreatePasswordProps = {
  setStep: Dispatch<SetStateAction<TOnboardingStep>>;
};

const CreatePassword = ({ setStep }: CreatePasswordProps) => {
  const { saveUser } = useStorage();
  const setUserState = useUserStore((state) => state.setUserState);
  const notify = useNotificationStore((state) => state.notify);
  const [saving, startSaving] = useTransition();

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

  const handleSave = ({ password }: TCreatePasswordFormData) => {
    startSaving(async () => {
      try {
        setUserState({ password, authenticated: true });
        await saveUser();
        notify({
          type: "success",
          message: "Password set. Your data is stored safely on this device.",
        });
        setStep(6);
      } catch (_) {
        notify({
          type: "error",
          message: "Couldn't finish setup. Please try again.",
        });
      }
    });
  };

  const renderFormError = () => {
    const errorMessages =
      errors.password?.message || errors.confirmPassword?.message;

    return errorMessages ? (
      <p className="py-1 text-yellow-500">{errorMessages}</p>
    ) : null;
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="box"
    >
      <h1 className="-mt-1">Create a Password</h1>
      <p className="-mt-1">
        It should be at least 8 characters.
        <br />
        You'll need this to unlock Vaultic.
      </p>

      <form
        onSubmit={handleSubmit(handleSave)}
        className="w-full flex flex-col gap-4 pt-2"
      >
        <PasswordInput {...register("password")} />
        <PasswordInput
          {...register("confirmPassword")}
          placeholder="Confirm password"
        />
        {renderFormError()}
        <Button
          type="submit"
          className={cn("w-full", {
            "opacity-60 pointer-events-none": !isValid,
          })}
          disabled={!isValid}
        >
          {saving ? <Loader size="sm" color="black" /> : "Next"}
        </Button>
      </form>
    </motion.div>
  );
};

export default CreatePassword;
