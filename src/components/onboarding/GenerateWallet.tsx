"use client";
import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useTransition,
} from "react";
import { motion } from "motion/react";
import { Button, Switch, Loader } from "@/components/ui";
import { TOnboardingStep } from "@/types";
import { generateMnemonic } from "bip39";
import useUserStore from "@/stores/userStore";
import useWallet from "@/hooks/useWallet";
import cn from "@/utils/cn";
import useNotificationStore from "@/stores/notificationStore";
import { TNetwork } from "@/types";
import { MnemonicView } from "@/components/common";
import { scaleUpAnimation } from "@/utils/animations";

type GenerateWalletProps = {
  network: TNetwork;
  setStep: Dispatch<SetStateAction<TOnboardingStep>>;
};

const GenerateWallet = ({ network, setStep }: GenerateWalletProps) => {
  const mnemonic = useUserStore((state) => state.mnemonic);
  const setUserState = useUserStore((state) => state.setUserState);
  const notify = useNotificationStore((state) => state.notify);
  const { createWallet } = useWallet();
  const [saved, setSaved] = useState(false);
  const [generating, startGenerating] = useTransition();

  useEffect(() => {
    if (!mnemonic) {
      const newMnemonic = generateMnemonic();
      setUserState({ mnemonic: newMnemonic });
    }
  }, []);

  const handleGenerate = () => {
    startGenerating(async () => {
      if (!saved) return;
      try {
        await createWallet(network);
        notify({
          type: "success",
          message: "Your new wallet is ready!",
        });
        setStep(5);
      } catch (_) {
        notify({
          type: "error",
          message:
            "Something went wrong while creating your wallet. Please try again.",
        });
      }
    });
  };

  return (
    <motion.div {...scaleUpAnimation()} className="box max-w-xl">
      <h1 className="-mt-2 mb-2 box-heading">Secret Recovery Phrase</h1>
      <MnemonicView lable="Save these words in a safe place." />
      <div
        className="flex gap-4 my-1.5 cursor-pointer select-none"
        onClick={() => setSaved((prev) => !prev)}
      >
        <div className="min-w-fit">
          <Switch state={saved} />
        </div>
        <p>I saved my secret recovery phrase.</p>
      </div>

      <div className="w-full flex items-center gap-4">
        <Button variant="zinc" className="w-1/2" onClick={() => setStep(3)}>
          Read the warning again
        </Button>

        <Button
          className={cn("w-1/2", {
            "opacity-60 pointer-events-none": !saved,
          })}
          disabled={!saved || generating}
          onClick={handleGenerate}
        >
          {generating ? <Loader size="sm" color="black" /> : "Next"}
        </Button>
      </div>
    </motion.div>
  );
};

export default GenerateWallet;
