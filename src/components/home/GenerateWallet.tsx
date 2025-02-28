"use client";
import { useState, Dispatch, SetStateAction, use } from "react";
import cn from "@/utils/cn";
import { motion } from "motion/react";
import { Button, Switch } from "@/components/ui";
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
      <h1 className="text-3xl font-medium heading-color">
        Secret Recovery Phrase
      </h1>
      <p className="text-lg text-teal">Save these words in a safe place.</p>

      <div className="w-full flex items-center justify-between gap-4 pt-2">
        <button
          onClick={() => setHide((prev) => !prev)}
          className="flex items-center gap-2.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${hide ? 576 : 640} 512`}
            className="size-5 fill-zinc-600 dark:fill-zinc-400"
          >
            <path
              d={
                hide
                  ? "M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"
                  : "M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"
              }
            />
          </svg>
          <span>{hide ? "Show seed phrase" : "Hide seed phrase"}</span>
        </button>

        <button
          onClick={() => copyToClipboard(mnemonic.join(" "))}
          className="flex items-center gap-2"
          disabled={copied}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={cn("size-5", {
              "fill-zinc-600 dark:fill-zinc-400": !copied,
              "fill-teal-500": copied,
            })}
          >
            {copied ? (
              <>
                <path
                  fillRule="evenodd"
                  d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z"
                  clipRule="evenodd"
                />
              </>
            ) : (
              <>
                <path
                  fillRule="evenodd"
                  d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 0 1-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0 1 13.5 1.5H15a3 3 0 0 1 2.663 1.618ZM12 4.5A1.5 1.5 0 0 1 13.5 3H15a1.5 1.5 0 0 1 1.5 1.5H12Z"
                  clipRule="evenodd"
                />
                <path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 0 1 9 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0 1 16.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625v-12Z" />
                <path d="M10.5 10.5a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963 5.23 5.23 0 0 0-3.434-1.279h-1.875a.375.375 0 0 1-.375-.375V10.5Z" />
              </>
            )}
          </svg>
          <span>{copied ? "Copied" : "Copy to clipboard"}</span>
        </button>
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
