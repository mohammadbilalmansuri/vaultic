"use client";
import { Dispatch, SetStateAction } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui";
import { Logo } from "@/components/ui/icons";
import { TOnboardingStep, TOnboardingPath } from "@/types";
import useNotificationStore from "@/stores/notificationStore";

type WelcomeProps = {
  setPath: Dispatch<SetStateAction<TOnboardingPath>>;
  setStep: Dispatch<SetStateAction<TOnboardingStep>>;
};

const Welcome = ({ setPath, setStep }: WelcomeProps) => {
  const notify = useNotificationStore((state) => state.notify);

  const setState = (path: TOnboardingPath) => {
    setPath(path);
    notify({
      type: "info",
      message:
        path === "create"
          ? "Let's create your new wallet!"
          : "Let's import your wallet securely!",
    });

    setStep(2);
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="box"
    >
      <Logo className="-mt-1 w-18 fill-teal-500" />
      <h3 className="text-lg text-teal-500">Welcome to Vaultic</h3>
      <h1>Let's Get Started</h1>
      <p className="-mt-px">
        Vaultic is a secure, web-based cryptocurrency wallet supporting Solana
        and Ethereum.
      </p>

      <div className="flex flex-col gap-4 pt-2">
        <Button
          variant="teal"
          className="w-full"
          onClick={() => setState("create")}
        >
          Create a new wallet
        </Button>
        <Button
          variant="zinc"
          className="w-full"
          onClick={() => setState("import")}
        >
          Import wallet
        </Button>
      </div>
    </motion.div>
  );
};

export default Welcome;
