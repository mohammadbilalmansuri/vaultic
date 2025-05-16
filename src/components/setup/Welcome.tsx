"use client";
import { Dispatch, SetStateAction } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui";
import { Logo } from "@/components/ui/icons";
import { TOnboardingStep, TOnboardingPath } from "@/types";
import useNotificationStore from "@/stores/notificationStore";
import { scaleUpAnimation } from "@/utils/animations";

type WelcomeProps = {
  setPath: Dispatch<SetStateAction<TOnboardingPath>>;
  setStep: Dispatch<SetStateAction<TOnboardingStep>>;
};

const Welcome = ({ setPath, setStep }: WelcomeProps) => {
  const notify = useNotificationStore((state) => state.notify);

  const handleStart = (path: TOnboardingPath) => {
    setPath(path);
    notify({
      type: "info",
      message:
        path === "create"
          ? "Let's create your new wallet!"
          : "Let's import your wallet securely!",
      duration: 3000,
    });
    setStep(2);
  };

  return (
    <motion.div {...scaleUpAnimation()} className="box">
      <Logo className="w-15 text-teal-500" />
      <h1 className="box-heading mt-2">Set Up Your Wallet</h1>
      <p>
        Choose how you'd like to get started. You can create a new wallet or
        import an existing one.
      </p>

      <div className="flex flex-col gap-4 mt-3">
        <Button className="w-full" onClick={() => handleStart("create")}>
          Create a new wallet
        </Button>
        <Button
          variant="zinc"
          className="w-full"
          onClick={() => handleStart("import")}
        >
          Import wallet
        </Button>
      </div>
    </motion.div>
  );
};

export default Welcome;
