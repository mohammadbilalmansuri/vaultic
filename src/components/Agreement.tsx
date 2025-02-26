"use client";
import { useState, Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import cn from "@/utils/cn";
import Button from "./ui/button";
import Switch from "./ui/switch";
import { TStep } from "@/app/page";

type AgreementProps = {
  setStep: Dispatch<SetStateAction<TStep>>;
};

const Agreement = ({ setStep }: AgreementProps) => {
  const [agree, setAgree] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="box max-w-xl"
    >
      <h1 className="h1 -mt-1">Secret Recovery Phrase Warning</h1>
      <p className="max-w-sm">
        On the next page, you will receive your secret recovery phrase.
      </p>

      <div className="mt-2 w-full flex items-center gap-4 text-left px-5 py-4 rounded-2xl bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-300/80 dark:border-zinc-700/60">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="size-5 fill-yellow-500 min-w-fit"
        >
          <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
        </svg>
        <p>
          This is the <span className="heading-color">ONLY</span> way to recover
          your account if you lose access to your device or password.
        </p>
      </div>

      <div className="-mt-1 w-full flex items-center gap-4 text-left px-5 py-4 rounded-2xl bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-300/80 dark:border-zinc-700/60">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="size-5 fill-teal-500 min-w-fit"
        >
          <path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z" />
        </svg>
        <p>
          Write it down, store it in a safe place, and{" "}
          <span className="heading-color">NEVER</span> share it with anyone.
        </p>
      </div>

      <div
        className="flex items-center gap-4 text-left py-1 cursor-pointer select-none"
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

export default Agreement;
