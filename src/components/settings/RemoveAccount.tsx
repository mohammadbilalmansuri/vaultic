"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VerifyPasswordSchema, TVerifyPasswordForm } from "@/utils/validations";
import { useWalletStore, useNotificationStore } from "@/stores";
import { useStorage } from "@/hooks";
import { DEV_PASSWORD, IS_DEV } from "@/constants";
import { Button, Loader, PasswordInput, FormError } from "../ui";
import cn from "@/utils/cn";

const RemoveAccount = () => {
  const router = useRouter();
  const { removeWallet } = useStorage();
  const notify = useNotificationStore((state) => state.notify);
  const [removing, startRemoving] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<TVerifyPasswordForm>({
    resolver: zodResolver(VerifyPasswordSchema),
    mode: "onChange",
    defaultValues: { password: IS_DEV ? DEV_PASSWORD : "" },
  });

  const handleRemove = ({ password }: TVerifyPasswordForm) => {
    startRemoving(async () => {
      try {
        if (useWalletStore.getState().password !== password) {
          setError("password", {
            message: "Incorrect password",
          });
          setTimeout(() => clearErrors("password"), 4000);
          return;
        }
        await removeWallet();
        notify({
          type: "success",
          message: "Account removed successfully.",
        });
        router.push("/");
      } catch {
        notify({
          type: "error",
          message: "Failed to remove account. Please try again.",
        });
      }
    });
  };

  return (
    <div className="w-full flex gap-6">
      <form
        onSubmit={handleSubmit(handleRemove)}
        className="w-full md:w-2/5 flex flex-col items-center gap-4"
      >
        <PasswordInput
          placeholder="Enter your password"
          {...register("password")}
        />
        <FormError errors={errors} />
        <Button
          type="submit"
          className={cn("w-full", {
            "opacity-60 pointer-events-none": !isValid,
          })}
          disabled={!isValid || removing}
        >
          {removing ? <Loader size="sm" color="black" /> : "Confirm & Remove"}
        </Button>
      </form>

      <div className="w-full md:w-3/5 p-5 rounded-2xl bg-warning text-center flex flex-col items-center justify-center gap-3">
        <p>
          Removing your account will only clear local access from this device.
          Your wallets remain safely stored and are not deleted permanently.
        </p>
        <p>
          You can always recover your Vaultic account using your recovery phrase
          in this or any compatible HD wallet.
        </p>
        <Link
          href="/help-and-support"
          target="_blank"
          className="leading-tight border-b border-current transition-all duration-300 hover:opacity-75"
        >
          Learn about recovery
        </Link>
      </div>
    </div>
  );
};

export default RemoveAccount;
