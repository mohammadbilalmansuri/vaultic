"use client";
import { useEffect, JSX } from "react";
import { motion } from "motion/react";
import { TSetupPath, TSetupSetStep } from "@/types";
import { useWalletStore, useNotificationStore } from "@/stores";
import { scaleUpAnimation } from "@/utils/animations";
import { useAccounts } from "@/hooks";
import { Loader } from "../ui";
import { Logo } from "../ui/icons";

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
      {...scaleUpAnimation({ duration: 0.15 })}
      className="box gap-0"
    >
      {StepProgress}

      <div className="p-10 w-full flex flex-col items-center gap-3">
        <div className="relative flex items-center justify-center">
          <Logo className="w-10 text-teal-500 absolute" />
          <Loader size="xl" />
        </div>

        <h2 className="text-2xl mt-5">
          {path === "create"
            ? "Setting up your new wallet"
            : "Importing your wallet securely"}
        </h2>

        <p>
          This only takes a few seconds. Please keep this tab open while we
          complete your setup.
        </p>
      </div>
    </motion.div>
  );
};

export default SettingUpWallet;
