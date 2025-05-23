"use client";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TChangePasswordForm, ChangePasswordSchema } from "@/utils/validations";
import { useNotificationStore } from "@/stores";
import { useStorage } from "@/hooks";
import { Button, Loader, PasswordInput, FormError } from "../ui";
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
  } = useForm<TChangePasswordForm>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: "onChange",
  });

  const handlePasswordChange = ({
    currentPassword,
    newPassword,
  }: TChangePasswordForm) => {
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
    <div className="w-full relative flex flex-col items-center gap-6">
      <form
        onSubmit={handleSubmit(handlePasswordChange)}
        className="w-full relative grid grid-cols-2 gap-4"
      >
        <PasswordInput
          placeholder="Current password"
          {...register("currentPassword")}
          autoFocus={true}
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
      <FormError errors={errors} />
    </div>
  );
};

export default ChangePassword;
