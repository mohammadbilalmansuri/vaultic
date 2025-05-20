"use client";
import { useEffect } from "react";
import { motion } from "motion/react";
import { Loader } from "@/components/ui";
import { Logo } from "@/components/ui/icons";
import { scaleUpAnimation } from "@/utils/animations";
import { TSetupPath, TSetupSetStep } from "@/types";
import { useWallet } from "@/hooks";
import SetupProgress from "./SetupProgress";

const SettingUpWallet = ({
  path,
  setStep,
}: {
  path: TSetupPath;
  setStep: TSetupSetStep;
}) => {
  const { setupWallet } = useWallet();

  useEffect(() => {
    setupWallet(setStep);
  }, []);

  return (
    <motion.div {...scaleUpAnimation()} className="setup-box gap-0">
      <SetupProgress step={4} />

      <div className="p-10 w-full flex flex-col items-center gap-3">
        <div className="relative flex items-center justify-center">
          <Logo className="w-10 text-teal-500 absolute" />
          <Loader size="xl" />
        </div>

        <h2 className="mt-5">
          {path === "create" ? "Creating your wallet" : "Importing your wallet"}
        </h2>
        <p>This should only take a few seconds. Please don't close this tab.</p>
      </div>
    </motion.div>
  );
};

export default SettingUpWallet;
