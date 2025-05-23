"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { generateMnemonic } from "bip39";
import { useWalletStore } from "@/stores";
import { TSetupSetStep } from "@/types";
import SetupProgress from "./SetupProgress";
import { MnemonicView, Button, Switch } from "../ui";
import { scaleUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";

const ShowRecoveryPhrase = ({ setStep }: { setStep: TSetupSetStep }) => {
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
    <motion.div {...scaleUpAnimation()} className="box gap-0">
      <SetupProgress step={3} />

      <div className="p-6 w-full flex flex-col items-center gap-4">
        <h2>Your recovery phrase</h2>
        <p className="-mt-1 mb-2">
          This phrase is your only backup. If you lose it, we can’t help you
          recover your wallet. Store it somewhere safe and never share it with
          anyone.
        </p>

        <MnemonicView mnemonic={mnemonic} />

        <div
          className="flex items-center gap-3 my-1.5 cursor-pointer select-none"
          onClick={() => setSaved((prev) => !prev)}
        >
          <Switch size="sm" state={saved} />
          <p>I saved my recovery phrase.</p>
        </div>

        <Button
          className={cn("w-full", {
            "opacity-60 pointer-events-none": !saved,
          })}
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
