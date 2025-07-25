"use client";
import { useTransition } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNotificationStore } from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { ChangePasswordForm, ChangePasswordSchema } from "@/utils/validations";
import { useStorage } from "@/hooks";
import { Button, Loader, PasswordInput, FormError } from "@/components/ui";

const ChangePasswordTabPanel = () => {
  const notify = useNotificationStore((state) => state.notify);
  const { updatePassword } = useStorage();
  const [changing, startChanging] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors, isValid },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: "onChange",
  });

  const handlePasswordChange = ({
    currentPassword,
    newPassword,
  }: ChangePasswordForm) => {
    startChanging(async () => {
      try {
        await updatePassword(currentPassword, newPassword);
        notify({
          type: "success",
          message: "Password changed successfully!",
        });
        reset();
      } catch (error) {
        setError("currentPassword", {
          message:
            error instanceof Error
              ? error.message
              : "Failed to change password",
        });
        setTimeout(() => clearErrors("currentPassword"), 4000);
      }
    });
  };

  return (
    <motion.div className="box max-w-lg" {...fadeUpAnimation()}>
      <h2 className="w-full sm:text-lg text-md font-medium text-primary border-b-1.5 p-3">
        Change Password
      </h2>

      <form
        onSubmit={handleSubmit(handlePasswordChange)}
        className="w-full flex flex-col sm:gap-4 gap-3 sm:p-6 p-5"
      >
        <PasswordInput
          placeholder="Current password"
          {...register("currentPassword")}
        />

        <PasswordInput
          placeholder="New password"
          {...register("newPassword")}
        />

        <PasswordInput
          placeholder="Confirm new password"
          {...register("confirmNewPassword")}
        />

        <Button
          type="submit"
          className={cn("w-full mt-0.5", {
            "opacity-60 pointer-events-none": !isValid,
          })}
          disabled={!isValid || changing}
        >
          {changing ? <Loader size="sm" color="current" /> : "Save"}
        </Button>

        <FormError errors={errors} />
      </form>
    </motion.div>
  );
};

export default ChangePasswordTabPanel;
