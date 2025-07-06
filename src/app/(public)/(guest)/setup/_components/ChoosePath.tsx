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
      {...scaleUpAnimation({ duration: hasMounted ? 0.15 : undefined })}
      className="box gap-6 xs:py-12 xs:px-12 py-10 px-8"
    >
      <Logo className="box-icon text-teal-500" aria-hidden={true} />
      <h2>Set up your wallet</h2>
      <p className="-mt-2">
        To get started, create a new wallet or import an existing one.
      </p>
      <div className="flex flex-col gap-4">
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
