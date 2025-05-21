"use client";
import { useEffect } from "react";
import { motion } from "motion/react";
import { Logo } from "@/components/ui/icons";
import { Loader } from "@/components/ui";
import SetupProgress from "./SetupProgress";
import { useAccounts, useStorage } from "@/hooks";
import { useWalletStore, useNotificationStore } from "@/stores";
import { TSetupPath, TSetupSetStep } from "@/types";
import { scaleUpAnimation } from "@/utils/animations";
import delay from "@/utils/delay";

const SettingUpWallet = ({
  path,
  setStep,
}: {
  path: TSetupPath;
  setStep: TSetupSetStep;
}) => {
  const { createAccount } = useAccounts();
  const { saveWallet } = useStorage();
  const setWalletState = useWalletStore((state) => state.setWalletState);
  const notify = useNotificationStore((state) => state.notify);

  useEffect(() => {
    (async () => {
      try {
        await createAccount();
        await saveWallet();
        await delay(2000);
        setWalletState({ walletExists: true, authenticated: true });
        setStep(5);
      } catch {
        notify({
          type: "error",
          message: "Failed to set up wallet. Please try again.",
        });
      }
    })();
  }, []);

  return (
    <motion.div {...scaleUpAnimation()} className="box gap-0">
      <SetupProgress step={4} />

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
