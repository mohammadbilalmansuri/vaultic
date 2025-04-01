"use client";
import { useState, MouseEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button, Wallet, Copy, Expand } from "@/components/ui";
import { useWallet, useStorage, useCopy } from "@/hooks";
import { useWalletStore } from "@/stores/walletStore";
import { Solana, Ethereum, Cancle } from "@/components/ui/icons";
import { TNetwork } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import cn from "@/utils/cn";

const Account = () => {
  const mnemonic = useUserStore((state) => state.mnemonic);
  const { copyToClipboard, copied } = useCopy();
  const { removeUser } = useStorage();
  const router = useRouter();

  const onCopy = (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    e.stopPropagation();
    copyToClipboard(mnemonic);
  };

  return (
    <div className="w-full max-w-screen-lg relative flex flex-col items-center flex-1 gap-5 py-5">
      <div className="w-full relative flex flex-col gap-5">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-2xl heading-color">Your Secret Phrase</h2>

          <Button className="h-10 px-5" onClick={removeUser}>
            Logout
          </Button>
        </div>

        <div
          className="w-full bg-zinc-200/60 dark:bg-zinc-800/50 hover:bg-zinc-200/90 dark:hover:bg-zinc-800/80 rounded-2xl flex flex-col px-5 pt-5 gap-5 cursor-pointer transition-all duration-400"
          onClick={() => copyToClipboard(mnemonic)}
        >
          <div className="w-full grid grid-cols-6 gap-4">
            {mnemonic.split(" ").map((word, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="opacity-80">{index + 1}.</span>
                <span className="lowercase heading-color">{word}</span>
              </div>
            ))}
          </div>

          <p
            className={cn(
              "text-sm leading-none py-4 border-t border-zinc-300/80 dark:border-zinc-700/60 text-center",
              {
                "text-teal-500": copied,
              }
            )}
          >
            {copied ? "Copied" : "Click anywhere on this card to copy"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Account;
