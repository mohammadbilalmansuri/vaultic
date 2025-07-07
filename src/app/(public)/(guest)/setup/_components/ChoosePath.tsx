"use client";
import { motion } from "motion/react";
import { TSetupPath, TSetupSetPath, TSetupSetStep } from "@/types";
import { scaleUpAnimation } from "@/utils/animations";
import { Button } from "@/components/ui";
import { Logo } from "@/components/ui/icons";

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
      aria-label="Choose Path Step"
      className="box xs:gap-6 gap-5 xs:p-12 p-8"
      {...scaleUpAnimation({ duration: hasMounted ? 0.15 : undefined })}
    >
      <Logo className="box-icon text-teal-500" aria-hidden={true} />
      <h1>Set up your wallet</h1>
      <p className="-mt-2">
        To get started, create a new wallet or import an existing one.
      </p>
      <div className="flex flex-col sm:gap-4 gap-3">
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
