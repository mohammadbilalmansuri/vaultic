"use client";
import { useTransition } from "react";
import { Input, Button, Loader, PasswordInput } from "@/components/ui";
import useNotificationStore from "@/stores/notificationStore";
import { useRouter } from "next/navigation";
import { useStorage } from "@/hooks";
import { useForm } from "react-hook-form";
import {
  verifyPasswordSchema,
  TVerifyPasswordFormData,
} from "@/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import cn from "@/utils/cn";
import Link from "next/link";
import { DEV_PASSWORD, IS_DEV } from "@/constants";

const RemoveAccount = () => {
  const notify = useNotificationStore((state) => state.notify);
  const router = useRouter();
  const { removeUser } = useStorage();
  const [removing, startRemoving] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TVerifyPasswordFormData>({
    resolver: zodResolver(verifyPasswordSchema),
    mode: "onChange",
    defaultValues: { password: IS_DEV ? DEV_PASSWORD : "" },
  });

  const removeAccount = ({ password }: TVerifyPasswordFormData) => {
    startRemoving(async () => {
      try {
        await removeUser();
        notify({
          type: "success",
          message: "Your account has been removed from this device.",
        });
        router.push("/");
      } catch {
        notify({
          type: "error",
          message: "We couldn't remove your account. Please try again.",
        });
      }
    });
  };

  return (
    <div className="w-full relative flex gap-5">
      <div className="w-1/2 flex flex-col items-center justify-center text-center gap-3 p-5 rounded-2xl bg-primary">
        <h2 className="text-lg font-medium heading-color">
          Removing Your Account
        </h2>

        <p>
          Even though you're removing your account from Vaultic, your wallets
          are not deleted permanently.
        </p>

        <p>
          You can recover your wallets at any time using your recovery phrase in
          Vaultic or another wallet that supports HD wallet derivation.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(removeAccount)}
        className="w-1/2 flex flex-col items-center gap-4"
      >
        <PasswordInput
          placeholder="Enter password to confirm"
          {...register("password")}
        />

        {errors.password?.message && (
          <p className="py-1 text-yellow-500">{errors.password?.message}</p>
        )}

        <Button
          type="submit"
          className={cn("w-full", {
            "opacity-60 pointer-events-none": !isValid,
          })}
          disabled={!isValid}
        >
          {removing ? <Loader size="sm" color="black" /> : "Remove Account"}
        </Button>

        <Link
          href="/help-and-support"
          className="hover:heading-color transition-all duration-300 border-b leading-tight"
          target="_blank"
        >
          Learn how recovery works
        </Link>
      </form>
    </div>
  );
};

export default RemoveAccount;
