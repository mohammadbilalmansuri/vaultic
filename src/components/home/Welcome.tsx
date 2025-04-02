"use client";
import { Dispatch, SetStateAction } from "react";
import { motion } from "motion/react";
import { Logo, Button } from "@/components/ui";
import { TStep, TPath } from "@/app/page";

type WelcomeProps = {
  setPath: Dispatch<SetStateAction<TPath>>;
  setStep: Dispatch<SetStateAction<TStep>>;
};

const Welcome = ({ setPath, setStep }: WelcomeProps) => {
  const setState = (path: TPath) => {
    setPath(path);
    setStep(2);
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="box"
    >
      <Logo size="lg" className="-mt-1" />
      <h3 className="text-lg text-teal-500">Welcome to Vaultic</h3>
      <h1>Let's Get Started</h1>
      <p>
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
