"use client";
import { Dispatch, SetStateAction } from "react";
import { TStep } from "@/types";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Button, PasswordInput } from "@/components/common";
import { passwordSchema, CreatePasswordFormData } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import useUserStore from "@/stores/userStore";
import { useStorage } from "@/hooks";
import useNotificationStore from "@/stores/notificationStore";
import { IS_DEV, DEV_PASSWORD } from "@/constants";

type CreatePasswordProps = {
  setStep: Dispatch<SetStateAction<TStep>>;
};

const CreatePassword = ({ setStep }: CreatePasswordProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    values: IS_DEV
      ? {
          password: DEV_PASSWORD,
          confirmPassword: DEV_PASSWORD,
        }
      : undefined,
  });

  const setUserState = useUserStore((state) => state.setUserState);
  const { saveUser } = useStorage();
  const notify = useNotificationStore((state) => state.notify);

  const onSubmit = async ({ password }: CreatePasswordFormData) => {
    try {
      setUserState({ password, authenticated: true });
      await saveUser();
      notify("User saved successfully!", "success");
      setStep(6);
    } catch (error) {
      console.error("Error saving user:", error);
      notify("Failed to save user", "error");
    }
  };

  const renderFormError = () => {
    const errorMessages =
      errors.password?.message || errors.confirmPassword?.message;

    return errorMessages ? (
      <p className="py-1 text-yellow-500 text-sm">{errorMessages}</p>
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
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4 pt-2"
      >
        <PasswordInput {...register("password")} />
        <PasswordInput
          {...register("confirmPassword")}
          placeholder="Confirm Password"
        />
        {renderFormError()}
        <Button className="w-full" type="submit">
          Next
        </Button>
      </form>
    </motion.div>
  );
};

export default CreatePassword;
