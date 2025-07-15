"use client";
import { motion } from "motion/react";
import { SetupPath, SetupSetPath, SetupSetStep } from "@/types";
import { scaleUpAnimation } from "@/utils/animations";
import { Logo } from "@/components/icons";
import { Button } from "@/components/ui";

const ChoosePath = ({
  setPath,
  setStep,
  hasMounted = false,
}: {
  setPath: SetupSetPath;
  setStep: SetupSetStep;
  hasMounted?: boolean;
}) => {
  const handleChoosePath = (path: SetupPath) => {
    setPath(path);
    setStep(2);
  };

  return (
    <motion.div
      key="choose-path"
      aria-label="Choose Path"
      className="box without-progress"
      {...scaleUpAnimation({ duration: hasMounted ? 0.15 : undefined })}
    >
      <Logo className="icon-lg text-teal-500" aria-hidden={true} />
      <h1>Set Up Your Wallet</h1>
      <p className="-mt-2.5">
        To get started, create a new wallet or import an existing one.
      </p>
      <div className="flex flex-col xs:gap-4 gap-3">
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
