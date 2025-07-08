"use client";
import { useState, useEffect, JSX } from "react";
import { motion } from "motion/react";
import { generateMnemonic } from "bip39";
import { TSetupSetStep } from "@/types";
import { useWalletStore } from "@/stores";
import { scaleUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { MnemonicView } from "@/components/shared";
import { Button, Switch } from "@/components/ui";

const ShowRecoveryPhrase = ({
  setStep,
  StepProgress,
}: {
  setStep: TSetupSetStep;
  StepProgress: JSX.Element;
}) => {
  const setWalletState = useWalletStore((state) => state.setWalletState);
  const [saved, setSaved] = useState(false);
  const [mnemonic, setMnemonic] = useState<string>("");

  useEffect(() => {
    const newMnemonic = generateMnemonic();
    setMnemonic(newMnemonic);
  }, []);

  const handleContinue = () => {
    setWalletState({ mnemonic });
    setStep(4);
  };

  return (
    <motion.div
      key="show-recovery-phrase"
      aria-label="Show Recovery Phrase"
      className="box"
      {...scaleUpAnimation({ duration: 0.15 })}
    >
      {StepProgress}

      <div className="w-full flex flex-col items-center xs:gap-6 gap-5 xs:p-6 p-5">
        <h1>Your Recovery Phrase</h1>
        <p className="-mt-2.5">
          This phrase is your only backup. If you lose it, we can’t help you
          recover your wallet. Store it somewhere safe and never share it with
          anyone.
        </p>

        <MnemonicView mnemonic={mnemonic} />

        <div
          className="flex items-center gap-3 -my-0.5 cursor-pointer select-none text-left"
          onClick={() => setSaved((prev) => !prev)}
        >
          <Switch size="sm" state={saved} />
          <p>I saved my recovery phrase.</p>
        </div>

        <Button
          className={cn("w-full", { "opacity-60 pointer-events-none": !saved })}
          disabled={!saved}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
};

export default ShowRecoveryPhrase;
