"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import { useNotificationStore } from "@/stores";
import { scaleUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { useStorage } from "@/hooks";
import { Button, Loader, Switch } from "@/components/ui";

const ForgotPassword = () => {
  const router = useRouter();
  const { removeWallet } = useStorage();
  const notify = useNotificationStore((state) => state.notify);
  const [agree, setAgree] = useState(false);
  const [resetting, startResetting] = useTransition();

  const handleReset = () => {
    startResetting(async () => {
      try {
        await removeWallet();
        router.replace("/setup");
        notify({
          type: "success",
          message: "Vaultic has been reset successfully.",
        });
      } catch {
        notify({
          type: "error",
          message: "Failed to reset Vaultic. Please try again.",
        });
      }
    });
  };

  return (
    <motion.div
      aria-label="Forgot Password"
      className="box xs:gap-6 gap-5 xs:p-6 p-5"
      {...scaleUpAnimation()}
    >
      <h1 className="mt-1">Forgot Your Password?</h1>

      <div className="w-full flex flex-col sm:gap-3 gap-2.5 -mt-2.5 -mb-1.5">
        <p>
          We understand — it happens. For your security, we cannot recover your
          password. Your original password is required to decrypt your recovery
          phrase and access your wallet.
        </p>

        <p>
          To continue, you&apos;ll need to reset Vaultic and re-import your
          wallet using your recovery phrase. For more details, visit our&nbsp;
          <Link href="/help-and-support" target="_blank" className="link">
            Help & Support
          </Link>
          &nbsp;page.
        </p>
      </div>

      <div
        className="flex items-center gap-3 cursor-pointer select-none text-left"
        onClick={() => setAgree((prev) => !prev)}
      >
        <Switch size="sm" state={agree} />
        <p className="leading-snug">I have my recovery phrase.</p>
      </div>

      <Button
        onClick={handleReset}
        disabled={!agree || resetting}
        className={cn("w-full mt-0.5", {
          "opacity-60 pointer-events-none": !agree,
        })}
      >
        {resetting ? <Loader size="sm" color="current" /> : "Reset Vaultic"}
      </Button>
    </motion.div>
  );
};

export default ForgotPassword;
