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
import { Copy, Hide } from "@/components/ui/icons";
import { TOnboardingStep } from "@/types";
import { useClipboard } from "@/hooks";
import { generateMnemonic } from "bip39";
import useUserStore from "@/stores/userStore";
import useWallet from "@/hooks/useWallet";
import cn from "@/utils/cn";
import useNotificationStore from "@/stores/notificationStore";
import { TNetwork } from "@/types";

type GenerateWalletProps = {
  network: TNetwork;
  setStep: Dispatch<SetStateAction<TOnboardingStep>>;
};

const GenerateWallet = ({ network, setStep }: GenerateWalletProps) => {
  const mnemonic = useUserStore((state) => state.mnemonic);
  const setUserState = useUserStore((state) => state.setUserState);
  const notify = useNotificationStore((state) => state.notify);
  const copyToClipboard = useClipboard();
  const { createWallet } = useWallet();

  const [saved, setSaved] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [copied, setCopied] = useState(false);
  const [generating, startGenerating] = useTransition();

  useEffect(() => {
    if (!mnemonic) {
      const newMnemonic = generateMnemonic();
      setUserState({ mnemonic: newMnemonic });
    }
  }, []);

  const handleNext = () => {
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
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="box max-w-xl"
    >
      <h1 className="-mt-1">Secret Recovery Phrase</h1>

      <div className="w-full relative bg-2 rounded-xl flex flex-col mt-1 overflow-hidden">
        <div className="border-color border-b-[1.5px] flex items-center justify-between py-3 px-4">
          <p className="leading-none">Save these words in a safe place.</p>
          <div className="flex items-center gap-4">
            <Hide hidden={hidden} onClick={() => setHidden((prev) => !prev)} />
            <Copy
              copied={copied}
              onClick={() => copyToClipboard(mnemonic, copied, setCopied)}
            />
          </div>
        </div>

        <div
          className="w-full grid grid-cols-2 xs:grid-cols-3 gap-4 cursor-pointer p-4"
          onClick={() => copyToClipboard(mnemonic, copied, setCopied)}
        >
          {mnemonic.split(" ").map((word, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="opacity-80">{index + 1}.</span>
              <span
                className={cn("lowercase heading-color", {
                  "tracking-[0.2em]": hidden,
                })}
              >
                {hidden ? Array(word.length).fill("•").join("") : word}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex gap-4 py-1 cursor-pointer select-none"
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
          disabled={!saved}
          onClick={handleNext}
        >
          {generating ? <Loader size="sm" color="black" /> : "Next"}
        </Button>
      </div>
    </motion.div>
  );
};

export default GenerateWallet;
