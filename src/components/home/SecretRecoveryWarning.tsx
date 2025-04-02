"use client";
import { useState, Dispatch, SetStateAction } from "react";
import { motion } from "motion/react";
import { Button, Switch, Warning, Lock } from "@/components/ui";
import { TStep } from "@/app/page";
import cn from "@/utils/cn";

type SecretRecoveryWarningProps = {
  setStep: Dispatch<SetStateAction<TStep>>;
};

const SecretRecoveryWarning = ({ setStep }: SecretRecoveryWarningProps) => {
  const [agree, setAgree] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="box max-w-xl"
    >
      <h1 className="-mt-1">Secret Recovery Phrase Warning</h1>
      <p className="max-w-sm -mt-1">
        On the next page, you will receive your secret recovery phrase.
      </p>

      <div className="mt-1 w-full flex items-center gap-4 text-left px-5 py-4 rounded-xl bg-zinc-200/60 dark:bg-zinc-800/50">
        <Warning className="size-5 fill-yellow-500 min-w-fit" />
        <p>
          This is the<span className="heading-color"> ONLY </span>way to recover
          your account if you lose access to your device or password.
        </p>
      </div>

      <div className="-mt-1 w-full flex items-center gap-4 text-left px-5 py-4 rounded-xl bg-zinc-200/60 dark:bg-zinc-800/50">
        <Lock className="size-5 fill-teal-500 min-w-fit" />
        <p>
          Write it down, store it in a safe place, and
          <span className="heading-color"> NEVER </span>share it with anyone.
        </p>
      </div>

      <div
        className="flex items-center gap-4 text-left cursor-pointer select-none"
        onClick={() => setAgree((prev) => !prev)}
      >
        <div className="min-w-fit">
          <Switch state={agree} />
        </div>
        <p>
          I understand that I am responsible for saving my secret recovery
          phrase, and that it is the only way to recover my wallet.
        </p>
      </div>

      <Button
        className={cn("w-full", {
          "opacity-60 pointer-events-none": !agree,
        })}
        onClick={() => setStep(4)}
        disabled={!agree}
      >
        Next
      </Button>
    </motion.div>
  );
};

export default SecretRecoveryWarning;
