"use client";
import { useState, useTransition } from "react";
import { Input, Button, Loader } from "@/components/ui";
import useNotificationStore from "@/stores/notificationStore";
import { useRouter } from "next/navigation";
import { useStorage } from "@/hooks";
import { useForm } from "react-hook-form";

export default function RemoveAccount() {
  const notify = useNotificationStore((s) => s.notify);
  const router = useRouter();
  const { removeUser } = useStorage();

  const [password, setPassword] = useState("");
  const [removing, startRemoving] = useTransition();

  const { register, handleSubmit } = useForm({
    defaultValues: { password: "" },
  });

  const removeAccount = () => {
    startRemoving(async () => {
      try {
        await removeUser();
        notify({ type: "success", message: "Account removed successfully." });
        router.push("/");
      } catch {
        notify({ type: "error", message: "Failed to remove account." });
      }
    });
  };

  if (removing) return <Loader size="md" />;

  return (
    <div className="flex flex-col gap-4 max-w-md">
      <p className="text-red-400 text-md">
        This will permanently delete your account and local data.
      </p>
      <form
        onSubmit={handleSubmit(removeAccount)}
        className="flex flex-col gap-4"
      >
        <Input
          type="password"
          placeholder="Enter your password to confirm"
          {...register("password", {
            required: "Password is required",
            validate: (value) => value === password || "Passwords do not match",
          })}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" disabled={!password}>
          Remove Account
        </Button>
      </form>
    </div>
  );
}
