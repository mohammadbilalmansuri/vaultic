"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEV_PASSWORD, IS_DEV } from "@/config";
import { useWalletStore, useNotificationStore } from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { VerifyPasswordSchema, TVerifyPasswordForm } from "@/utils/validations";
import { useStorage } from "@/hooks";
import { Button, Loader, PasswordInput, FormError } from "@/components/ui";

const RemoveWalletTab = () => {
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
        const { password: storedPassword } = useWalletStore.getState();

        if (storedPassword !== password) {
          setError("password", { message: "Incorrect password" });
          setTimeout(() => clearErrors("password"), 4000);
          return;
        }

        await removeWallet();
        router.replace("/");
        notify({ type: "success", message: "Wallet removed successfully." });
      } catch {
        notify({
          type: "error",
          message: "Failed to remove wallet. Please try again.",
        });
      }
    });
  };

  return (
    <motion.div className="box max-w-lg gap-0" {...fadeUpAnimation()}>
      <h3 className="w-full text-lg font-medium heading-color border-b-1.5 border-color p-3">
        Remove Wallet
      </h3>

      <div className="w-full flex flex-col gap-6 p-6">
        <div className="w-full p-5 rounded-2xl bg-warning text-center flex flex-col items-center justify-center gap-2.5">
          <p>
            Removing your wallet will erase local access and settings from this
            device.
          </p>

          <p>
            Your accounts and assets remain safe on the blockchain. You can
            recover everything using your recovery phrase in Vaultic or any
            compatible HD wallet.
          </p>

          <Link
            href="/help-and-support"
            target="_blank"
            className="leading-tight border-b border-current transition-all duration-300 hover:opacity-75 mt-0.5"
          >
            Learn about recovery
          </Link>
        </div>

        <form
          onSubmit={handleSubmit(handleRemove)}
          className="w-full flex flex-col items-center gap-4"
        >
          <PasswordInput
            placeholder="Password"
            {...register("password")}
            autoFocus
          />

          <Button
            type="submit"
            className={cn("w-full mt-px", {
              "opacity-60 pointer-events-none": !isValid,
            })}
            disabled={!isValid || removing}
          >
            {removing ? <Loader size="sm" color="black" /> : "Confirm & Remove"}
          </Button>

          <FormError errors={errors} />
        </form>
      </div>
    </motion.div>
  );
};

export default RemoveWalletTab;
