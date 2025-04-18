"use client";
import { useState } from "react";
import { Button, PasswordInput } from "@/components/ui";
import useNotificationStore from "@/stores/notificationStore";
import { useForm } from "react-hook-form";

export default function ChangePassword() {
  const notify = useNotificationStore((s) => s.notify);
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const handlePasswordChange = () => {
    // TODO: integrate real password logic
    if (passwords.newPass !== passwords.confirm) {
      notify({ type: "error", message: "Passwords do not match." });
      return;
    }
    notify({ type: "success", message: "Password changed (mock)." });
  };

  const { register, handleSubmit } = useForm({
    defaultValues: passwords,
  });

  return (
    <div className="flex flex-col gap-4 max-w-md">
      <form
        onSubmit={handleSubmit(handlePasswordChange)}
        className="flex flex-col gap-4"
      >
        <PasswordInput
          placeholder="Current password"
          {...register("current")}
        />
        <PasswordInput placeholder="New password" {...register("newPass")} />
        <PasswordInput
          placeholder="Confirm new password"
          {...register("confirm")}
        />
      </form>
      <Button onClick={handlePasswordChange}>Change Password</Button>
    </div>
  );
}
