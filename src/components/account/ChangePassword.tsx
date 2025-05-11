"use client";
import { useTransition } from "react";
import { Button, Loader, PasswordInput } from "@/components/ui";
import useNotificationStore from "@/stores/notificationStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TChangePasswordFormData,
  changePasswordSchema,
} from "@/utils/validations";
import { useStorage } from "@/hooks";
import cn from "@/utils/cn";

const ChangePassword = () => {
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
  } = useForm<TChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  const handlePasswordChange = ({
    currentPassword,
    newPassword,
  }: TChangePasswordFormData) => {
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

  const renderFormError = () => {
    const errorMessage =
      errors.currentPassword?.message ||
      errors.newPassword?.message ||
      errors.confirmNewPassword?.message;

    return errorMessage ? (
      <p className="text-yellow-500">{errorMessage}</p>
    ) : null;
  };

  return (
    <div className="w-full relative flex flex-col items-center gap-6">
      <form
        onSubmit={handleSubmit(handlePasswordChange)}
        className="w-full relative grid grid-cols-2 gap-4"
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
          className={cn({
            "opacity-60 pointer-events-none": !isValid,
          })}
          disabled={!isValid || changing}
        >
          {changing ? <Loader size="sm" color="black" /> : "Change Password"}
        </Button>
      </form>

      {renderFormError()}
    </div>
  );
};

export default ChangePassword;
