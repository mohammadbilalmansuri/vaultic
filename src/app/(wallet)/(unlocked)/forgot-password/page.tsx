"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useStorage } from "@/hooks";
import useNotificationStore from "@/stores/notificationStore";
import { scaleUpAnimation } from "@/utils/animations";
import { Button, Loader, Switch } from "@/components/ui";
import Link from "next/link";
import cn from "@/utils/cn";

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
        notify({
          type: "success",
          message: "Vaultic has been reset successfully.",
        });
        router.push("/onboarding");
      } catch {
        notify({
          type: "error",
          message: "Failed to reset Vaultic. Please try again.",
        });
      }
    });
  };

  return (
    <motion.div {...scaleUpAnimation()} className="box max-w-2xl">
      <h1 className="-mt-2 box-heading">Forgot your password?</h1>

      <div className="flex flex-col gap-3">
        <p>
          For your security, Vaultic does not store your password. Your recovery
          phrase is encrypted using your password — which means without it, we
          can't decrypt your wallets.
        </p>

        <p>
          If you've lost your password, the safest solution is to reset Vaultic
          and start fresh using your recovery phrase. You can re-import any
          wallet tied to that phrase.
        </p>

        <p>
          This process protects your assets and ensures that only you can access
          your wallets. For more details, visit the{" "}
          <Link
            href="/help-and-support"
            target="_blank"
            className="heading-color border-b border-transparent hover:border-current transition-colors duration-300"
          >
            Help & Support
          </Link>{" "}
          page.
        </p>
      </div>

      <div
        className="flex items-center gap-4 mb-2 mt-1.5 text-left cursor-pointer select-none"
        onClick={() => setAgree((prev) => !prev)}
        role="checkbox"
        aria-checked={agree}
      >
        <Switch state={agree} />
        <p>I understand the recovery process and want to reset Vaultic</p>
      </div>

      <div className="w-full flex items-center gap-4 mt-1">
        <Button
          variant="zinc"
          className="w-full sm:w-1/2"
          onClick={() => router.push("/dashboard")}
        >
          I remember my password
        </Button>

        <Button
          className={cn("w-full sm:w-1/2", {
            "opacity-60 pointer-events-none": !agree,
          })}
          onClick={handleReset}
          disabled={!agree || resetting}
        >
          {resetting ? <Loader size="sm" color="black" /> : "Reset Vaultic"}
        </Button>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
