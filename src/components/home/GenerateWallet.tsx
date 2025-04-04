"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { motion } from "motion/react";
import { Button, Switch } from "@/components/common";
import { TStep } from "@/app/page";
import { useCopy } from "@/hooks";
import { generateMnemonic } from "bip39";
import { useUserStore, TNetwork } from "@/stores/userStore";
import useWallet from "@/hooks/useWallet";
import cn from "@/utils/cn";
import { useNotificationStore } from "@/stores/notificationStore";

type GenerateWalletProps = {
  network: TNetwork;
  setStep: Dispatch<SetStateAction<TStep>>;
};

const GenerateWallet = ({ network, setStep }: GenerateWalletProps) => {
  const { copied, copyToClipboard } = useCopy();
  const [saved, setSaved] = useState(false);
  const { createWallet } = useWallet();
  const mnemonic = useUserStore((state) => state.mnemonic);
  const setState = useUserStore((state) => state.setState);
  const notify = useNotificationStore((state) => state.notify);

  useEffect(() => {
    if (!mnemonic) {
      const newMnemonic = generateMnemonic();
      setState({ mnemonic: newMnemonic });
    }
  }, []);

  const handleNext = async () => {
    await createWallet(network);
    notify("Wallet created successfully!", "success");
    setStep(5);
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="box max-w-xl"
    >
      <h1 className="-mt-1">Secret Recovery Phrase</h1>
      <p className="text-lg text-teal-500 -mt-1">
        Save these words in a safe place.
      </p>

      <div
        className="w-full bg-zinc-200/60 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl flex flex-col px-4 pt-4 gap-4 mt-1 cursor-pointer transition-all duration-300"
        onClick={() => copyToClipboard(mnemonic)}
      >
        <div className="w-full grid grid-cols-2 xs:grid-cols-3 gap-4">
          {mnemonic.split(" ").map((word, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="opacity-80">{index + 1}.</span>
              <span className="lowercase heading-color">{word}</span>
            </div>
          ))}
        </div>

        <p className="text-sm leading-none py-3 border-t border-zinc-300/80 dark:border-zinc-700/60 text-center">
          {copied ? "Copied" : "Click anywhere on this card to copy"}
        </p>
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
          Next
        </Button>
      </div>
    </motion.div>
  );
};

export default GenerateWallet;
