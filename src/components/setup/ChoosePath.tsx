"use client";
import { motion } from "motion/react";
import { Button } from "@/components/ui";
import { Logo } from "@/components/ui/icons";
import { TSetupPath, TSetupSetPath, TSetupSetStep } from "@/types";
import { scaleUpAnimation } from "@/utils/animations";

const ChoosePath = ({
  setPath,
  setStep,
}: {
  setPath: TSetupSetPath;
  setStep: TSetupSetStep;
}) => {
  const handleChoosePath = (path: TSetupPath) => {
    setPath(path);
    setStep(2);
  };

  return (
    <motion.div {...scaleUpAnimation()} className="setup-box p-12">
      <Logo className="w-15 text-teal-500" />
      <h2 className="mt-3">Set up your wallet</h2>
      <p>To get started, create a new wallet or import an existing one.</p>
      <div className="flex flex-col gap-4 mt-3">
        <Button className="w-full" onClick={() => handleChoosePath("create")}>
          Create a new wallet
        </Button>
        <Button
          variant="zinc"
          className="w-full"
          onClick={() => handleChoosePath("import")}
        >
          Import an existing wallet
        </Button>
      </div>
    </motion.div>
  );
};

export default ChoosePath;
