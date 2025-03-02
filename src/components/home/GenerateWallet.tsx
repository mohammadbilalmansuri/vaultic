"use client";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import cn from "@/utils/cn";
import { motion } from "motion/react";
import { Button, Switch, Copy, Hide } from "@/components/ui";
import { TStep } from "@/app/page";
import { useCopy } from "@/hooks";
import { generateMnemonic } from "bip39";

type GenerateWalletProps = {
  setStep: Dispatch<SetStateAction<TStep>>;
};

const GenerateWallet = ({ setStep }: GenerateWalletProps) => {
  const { copied, copyToClipboard } = useCopy();
  const [saved, setSaved] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [mnemonic, setMnemonic] = useState<string>("");

  useEffect(() => {
    const words = generateMnemonic();
    setMnemonic(words);
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="box max-w-xl"
    >
      <h1>Secret Recovery Phrase</h1>
      <p className="text-lg text-teal">Save these words in a safe place.</p>

      <div className="w-full flex items-center justify-between gap-4 pt-2">
        <Hide
          hidden={hidden}
          withText={true}
          onClick={() => setHidden((prev) => !prev)}
        />

        <Copy
          copied={copied}
          withText={true}
          text={{ copied: "Copied", copy: "Copy to clipboard" }}
          onClick={() => copyToClipboard(mnemonic)}
          disabled={copied}
        />
      </div>

      <div
        className={cn(
          "w-full grid gap-2 grid-cols-2 xs:grid-cols-3 cursor-pointer",
          {
            "pointer-events-none": copied,
          }
        )}
        onClick={() => copyToClipboard(mnemonic)}
      >
        {mnemonic.split(" ").map((word, index) => (
          <div
            key={index}
            className="px-3 py-2 flex items-center gap-2 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-lg border-2 border-zinc-200 dark:border-zinc-800"
          >
            <span className="opacity-60">{index + 1}.</span>
            <span className="lowercase heading-color">
              {hidden
                ? Array.from({ length: word.length }, () => "●").join("")
                : word}
            </span>
          </div>
        ))}
      </div>

      <div
        className="flex gap-4 py-2 cursor-pointer select-none"
        onClick={() => setSaved((prev) => !prev)}
      >
        <div className="min-w-fit">
          <Switch state={saved} />
        </div>
        <p>I saved my secret recovery phrase.</p>
      </div>

      <div className="w-full flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={() => setStep(3)}
          className="w-1/2"
        >
          Read the warning again
        </Button>
        <Button
          className={cn("w-1/2", {
            "opacity-60 pointer-events-none": !saved,
          })}
          onClick={() => setStep(5)}
          disabled={!saved}
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
};

export default GenerateWallet;
