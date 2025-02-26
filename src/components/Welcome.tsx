"use client";

import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import Button from "./ui/button";
import { TStep, TPath } from "@/app/page";

type WelcomeProps = {
  setPath: Dispatch<SetStateAction<TPath>>;
  setStep: Dispatch<SetStateAction<TStep>>;
};

export default function Welcome({ setPath, setStep }: WelcomeProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg flex flex-col items-center text-center gap-5 border border-color rounded-2xl p-10"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        className="size-20 fill-teal-500"
      >
        <path d="M156.8 126.8c37.6 60.6 64.2 113.1 84.3 162.5-8.3 33.8-18.8 66.5-31.3 98.3-13.2-52.3-26.5-101.3-56-148.5 6.5-36.4 2.3-73.6 3-112.3zM109.3 200H16.1c-6.5 0-10.5 7.5-6.5 12.7C51.8 267 81.3 330.5 101.3 400h103.5c-16.2-69.7-38.7-133.7-82.5-193.5-3-4-8-6.5-13-6.5zm47.8-88c68.5 108 130 234.5 138.2 368H409c-12-138-68.4-265-143.2-368H157.1zm251.8-68.5c-1.8-6.8-8.2-11.5-15.2-11.5h-88.3c-5.3 0-9 5-7.8 10.3 13.2 46.5 22.3 95.5 26.5 146 48.2 86.2 79.7 178.3 90.6 270.8 15.8-60.5 25.3-133.5 25.3-203 0-73.6-12.1-145.1-31.1-212.6z" />
      </svg>

      <h3 className="text-lg text-teal-500">Welcome to Vaultic</h3>
      <h1 className="text-4xl font-medium">Let's get started</h1>
      <p className="text-lg dark:text-zinc-400 text-zinc-500 pb-4">
        Vaultic is a secure, web-based cryptocurrency wallet supporting Solana
        and Ethereum.
      </p>

      <div className="flex flex-col gap-4">
        <Button
          variant="primary"
          className="w-full"
          onClick={() => {
            setPath("create");
            setStep(2);
          }}
        >
          Create a new wallet
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            setPath("import");
            setStep(2);
          }}
        >
          Import wallet
        </Button>
      </div>
    </motion.div>
  );
}
