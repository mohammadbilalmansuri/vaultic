"use client";
import { useState, Dispatch, SetStateAction, use } from "react";
import cn from "@/utils/cn";
import { motion } from "motion/react";
import { Button, Switch, Copy, Hide } from "@/components/ui";
import { TStep } from "@/app/page";
import { useCopy } from "@/hooks";

type GenerateWalletProps = {
  setStep: Dispatch<SetStateAction<TStep>>;
};

const GenerateWallet = ({ setStep }: GenerateWalletProps) => {
  const { copied, copyToClipboard } = useCopy();
  const [saved, setSaved] = useState(false);
  const [hide, setHide] = useState(true);

  const mnemonic = [
    "mohammadbi",
    "mohammadbi",
    "mohammadbi",
    "mohammadbi",
    "mohammadbi",
    "mohammadbi",
    "mohammadbi",
    "mohammadbi",
    "mohammadbi",
    "mohammadbi",
    "mohammadbi",
    "mohammadbi",
  ];

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
          hidden={hide}
          withText={true}
          onClick={() => setHide((prev) => !prev)}
        />

        <Copy
          copied={copied}
          withText={true}
          onClick={() => copyToClipboard(mnemonic.join(" "))}
          disabled={copied}
        />
      </div>

      <div
        className="w-full border-1.5 border-color rounded-xl cursor-pointer"
        onClick={() => copyToClipboard(mnemonic.join(" "))}
      >
        <table className="w-full">
          <tbody className="divide-y-[1.5px] divide-zinc-400 dark:divide-zinc-600">
            {Array.from({ length: 4 }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className="divide-x-[1.5px] divide-zinc-400 dark:divide-zinc-600 w-full grid grid-cols-3"
              >
                {mnemonic
                  .slice(rowIndex * 3, rowIndex * 3 + 3)
                  .map((word, index) => (
                    <td
                      key={index}
                      className="px-4 py-2 flex items-center gap-1.5"
                    >
                      <span className="opacity-70">
                        {rowIndex * 3 + index + 1}.
                      </span>
                      <input
                        type={hide ? "password" : "text"}
                        name={`${rowIndex * 3 + index + 1}`}
                        id={`${rowIndex * 3 + index + 1}`}
                        readOnly
                        value={word}
                        className="lowercase bg-transparent outline-none flex-1 w-full text-left cursor-pointer"
                      />
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
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
