"use client";
import { useEffect, JSX } from "react";
import { motion } from "motion/react";
import { TSetupPath, TSetupSetStep } from "@/types";
import { useWalletStore, useNotificationStore } from "@/stores";
import { scaleUpAnimation } from "@/utils/animations";
import { useAccounts } from "@/hooks";
import { IconProcessing } from "@/components/ui";
import { Logo } from "@/components/ui/icons";

const SettingUpWallet = ({
  path,
  setStep,
  StepProgress,
}: {
  path: TSetupPath;
  setStep: TSetupSetStep;
  StepProgress: JSX.Element;
}) => {
  const { createAccount } = useAccounts();
  const setWalletState = useWalletStore((state) => state.setWalletState);
  const notify = useNotificationStore((state) => state.notify);

  useEffect(() => {
    (async () => {
      try {
        await createAccount(true);
        setWalletState({
          suppressRedirect: true,
          walletExists: true,
          authenticated: true,
        });
        setStep(5);
      } catch {
        notify({
          type: "error",
          message: "Failed to set up wallet. Please try again.",
        });
        setStep(3);
      }
    })();
  }, []);

  return (
    <motion.div
      key="setting-up-wallet"
      aria-label="Setting Up Wallet"
      className="box"
      {...scaleUpAnimation({ duration: 0.15 })}
    >
      {StepProgress}

      <div className="w-full flex flex-col items-center xs:gap-6 gap-5 p-8">
        <IconProcessing>
          <Logo className="w-8 text-teal-500" />
        </IconProcessing>

        <h3>
          {path !== "create"
            ? "Setting up your new wallet"
            : "Importing your wallet"}
        </h3>

        <p className="-mt-2.5">
          This only takes a few seconds. Please keep this tab open while we
          complete your setup.
        </p>
      </div>
    </motion.div>
  );
};

export default SettingUpWallet;
