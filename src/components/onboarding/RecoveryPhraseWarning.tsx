"use client";
import { useState, Dispatch, SetStateAction } from "react";
import { motion } from "motion/react";
import { Button, Switch } from "@/components/ui";
import { Warning, Lock } from "@/components/ui/icons";
import { TOnboardingStep } from "@/types";
import cn from "@/utils/cn";
import { scaleUpAnimation } from "@/utils/animations";

type RecoveryPhraseWarningProps = {
  setStep: Dispatch<SetStateAction<TOnboardingStep>>;
};

const RecoveryPhraseWarning = ({ setStep }: RecoveryPhraseWarningProps) => {
  const [agree, setAgree] = useState(false);

  return (
    <motion.div {...scaleUpAnimation()} className="box max-w-xl">
      <h1 className="-mt-1 onboarding-heading">
        Secret Recovery Phrase Warning
      </h1>
      <p className="max-w-sm -mt-1">
        On the next page, you will receive your secret recovery phrase.
      </p>

      <div className="mt-1 w-full flex items-center gap-4 text-left p-4 rounded-2xl bg-primary">
        <span className="min-w-fit">
          <Warning className="w-6 text-yellow-500" />
        </span>
        <p>
          This is the <span className="heading-color">ONLY</span> way to recover
          your account if you lose access to your device or password.
        </p>
      </div>

      <div className="-mt-1 w-full flex items-center gap-4 text-left p-4 rounded-2xl bg-primary">
        <span className="min-w-fit">
          <Lock className="w-6 text-teal-500" />
        </span>
        <p>
          Write it down, store it in a safe place, and{" "}
          <span className="heading-color">NEVER</span> share it with anyone.
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

export default RecoveryPhraseWarning;
