"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEV_PASSWORD, IS_DEV } from "@/config";
import { getWalletState, useNotificationActions } from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { VerifyPasswordSchema, VerifyPasswordForm } from "@/utils/validations";
import { useStorage } from "@/hooks";
import { Button, Loader, PasswordInput, FormError } from "@/components/ui";

const RemoveWalletTabPanel = () => {
  const { notify } = useNotificationActions();
  const router = useRouter();
  const { removeWallet } = useStorage();

  const [removing, startRemoving] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<VerifyPasswordForm>({
    resolver: zodResolver(VerifyPasswordSchema),
    mode: "onChange",
    defaultValues: { password: IS_DEV ? DEV_PASSWORD : "" },
  });

  const handleRemove = ({ password }: VerifyPasswordForm) => {
    startRemoving(async () => {
      try {
        const storedPassword = getWalletState().password;

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
    <motion.div className="box max-w-lg" {...fadeUpAnimation()}>
      <h2 className="w-full sm:text-lg text-md font-medium text-primary border-b-1.5 p-3">
        Remove Wallet
      </h2>

      <div className="w-full flex flex-col items-center sm:gap-6 gap-5 sm:p-6 p-5">
        <div className="highlight-yellow border w-full p-4 rounded-2xl text-center flex flex-col items-center sm:gap-2.5 gap-2">
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
            className="leading-none border-b border-current transition-opacity duration-200 hover:opacity-75 mt-1"
            aria-label="Learn about wallet recovery process in Help & Support Page (opens in new tab)"
          >
            Learn about recovery
          </Link>
        </div>

        <form
          onSubmit={handleSubmit(handleRemove)}
          className="w-full flex flex-col items-center sm:gap-4 gap-3"
        >
          <PasswordInput placeholder="Password" {...register("password")} />

          <Button
            type="submit"
            className={cn("w-full mt-0.5", {
              "opacity-60 pointer-events-none": !isValid,
            })}
            disabled={!isValid || removing}
          >
            {removing ? (
              <Loader size="sm" color="current" />
            ) : (
              "Confirm & Remove"
            )}
          </Button>

          <FormError errors={errors} />
        </form>
      </div>
    </motion.div>
  );
};

export default RemoveWalletTabPanel;
