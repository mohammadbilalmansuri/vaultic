"use client";
import { motion } from "motion/react";
import { TSetupPath, TSetupSetPath, TSetupSetStep } from "@/types";
import { scaleUpAnimation } from "@/utils/animations";
import { Button } from "../ui";
import { Logo } from "../ui/icons";

const ChoosePath = ({
  setPath,
  setStep,
  hasMounted = false,
}: {
  setPath: TSetupSetPath;
  setStep: TSetupSetStep;
  hasMounted?: boolean;
}) => {
  const handleChoosePath = (path: TSetupPath) => {
    setPath(path);
    setStep(2);
  };

  return (
    <motion.div
      key="choose-path"
      {...scaleUpAnimation({ duration: hasMounted ? 0.15 : undefined })}
      className="box p-12"
    >
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
