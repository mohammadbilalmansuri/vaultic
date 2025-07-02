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
    <motion.div {...scaleUpAnimation()} className="box max-w-2xl p-12">
      <h2 className="-mt-1.5">Forgot your password?</h2>

      <div className="flex flex-col gap-2.5">
        <p>
          For your security, Vaultic never stores your password directly.
          Instead, your password is used to create a secure encryption key
          (AES-GCM, 256-bit) that encrypts your recovery phrase. Because only
          this key can decrypt your recovery phrase — and the key itself is
          derived from your password — we can’t unlock your accounts without it.
        </p>

        <p>
          If you’ve lost your password, the only way to access your accounts is
          to reset Vaultic and re-import your wallet using your recovery phrase.
          This ensures your funds remain safe and only you can unlock them.
        </p>

        <p>
          If you’re unsure or want more information, visit the{" "}
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
        className="flex items-center gap-3 my-2.5 cursor-pointer select-none text-left"
        onClick={() => setAgree((prev) => !prev)}
      >
        <Switch size="sm" state={agree} />
        <p className="leading-snug">
          I understand this process will permanently remove Vaultic data and I’m
          ready to re-import my wallet.
        </p>
      </div>

      <Button
        className={cn("w-full mt-1.5", {
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
