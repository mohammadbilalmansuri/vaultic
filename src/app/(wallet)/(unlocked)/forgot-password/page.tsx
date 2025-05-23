"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import { useNotificationStore } from "@/stores";
import { useStorage } from "@/hooks";
import { Button, Loader, Switch } from "@/components/ui";
import { scaleUpAnimation } from "@/utils/animations";
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
        router.replace("/setup");
      } catch {
        notify({
          type: "error",
          message: "Failed to reset Vaultic. Please try again.",
        });
      }
    });
  };

  return (
    <motion.div {...scaleUpAnimation()} className="box max-w-2xl p-12">
      <h2 className="-mt-2">Forgot your password?</h2>

      <div className="flex flex-col gap-2">
        <p>
          For your security, Vaultic does not store your password. Your recovery
          phrase is encrypted using your password — which means without it, we
          can’t decrypt your accounts.
        </p>

        <p>
          If you’ve lost your password, the safest solution is to reset Vaultic
          and start fresh using your recovery phrase. You can re-import your
          accounts tied to that phrase.
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
        className="flex items-center gap-3 my-1.5 cursor-pointer select-none text-left"
        onClick={() => setAgree((prev) => !prev)}
      >
        <Switch size="sm" state={agree} />
        <p>I understand the recovery process and want to reset Vaultic</p>
      </div>

      <Button
        className={cn("w-full", {
          "opacity-60 pointer-events-none": !agree,
        })}
        onClick={handleReset}
        disabled={!agree || resetting}
      >
        {resetting ? <Loader size="sm" color="black" /> : "Reset Vaultic"}
      </Button>
    </motion.div>
  );
};

export default ForgotPassword;
