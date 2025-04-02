"use client";
import { Dispatch, SetStateAction } from "react";
import { TStep } from "@/app/page";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Button, PasswordInput } from "@/components/ui";
import { passwordSchema, PasswordFormData } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/stores/userStore";
import { useStorage } from "@/hooks";

type CreatePasswordProps = {
  setStep: Dispatch<SetStateAction<TStep>>;
};

const CreatePassword = ({ setStep }: CreatePasswordProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
  });

  const setState = useUserStore((state) => state.setState);

  const { saveUser } = useStorage();

  const onSubmit = async ({ password }: PasswordFormData) => {
    setState({ password, authenticated: true });
    await saveUser();
    setStep(6);
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
