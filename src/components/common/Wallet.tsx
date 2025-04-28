"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Solana,
  Ethereum,
  Copy,
  Hide,
  Expand,
  Delete,
} from "@/components/ui/icons";
import { useClipboard, useWallet } from "@/hooks";
import { IWallet } from "@/types";
import { NETWORK_TOKENS } from "@/constants";

interface WalletProps extends IWallet {
  isSingle: boolean;
}

const Wallet = ({
  index,
  network,
  address,
  privateKey,
  balance,
  isSingle,
}: WalletProps) => {
  const { deleteWallet } = useWallet();
  const copyToClipboard = useClipboard();
  const [expanded, setExpanded] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [copied, setCopied] = useState(false);

  return (
    <div className="w-full rounded-2xl relative p-5 flex flex-col transition-all duration-300 border-2 border-color">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          {network === "solana" ? (
            <Solana className="size-10 bg-zinc-300/60 dark:bg-zinc-700/60 p-2.5 rounded-lg" />
          ) : (
            <Ethereum className="size-10 bg-zinc-300/60 dark:bg-zinc-700/60 p-2 rounded-lg" />
          )}

          <div className="flex flex-col gap-0.5">
            <h3 className="text-xl heading-color capitalize">
              {`${network} Wallet ${index + 1}`}
            </h3>
            <p>{address}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <p className="heading-color leading-none">
            {balance} {NETWORK_TOKENS[network]}
          </p>
          {!isSingle && expanded && <Delete className="icon" />}
          <Expand
            className="icon"
            expanded={expanded}
            onClick={() => setExpanded((prev) => !prev)}
          />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden w-full flex flex-col gap-2"
          >
            <h4 className="pt-6 heading-color text-lg leading-none">
              Private Key
            </h4>

            <div className="w-full flex items-center justify-between gap-4 cursor-pointer">
              <p
                className="hover:heading-color transition-all duration-300"
                onClick={() => copyToClipboard(privateKey, copied, setCopied)}
              >
                {hidden ? (
                  <span className="tracking-[0.2em]">
                    {Array(privateKey.length).fill("•").join("")}
                  </span>
                ) : (
                  privateKey
                )}
              </p>

              <div className="flex items-center gap-4">
                <Hide
                  hidden={hidden}
                  onClick={() => setHidden((prev) => !prev)}
                />
                <Copy
                  copied={copied}
                  className="w-5"
                  onClick={() => copyToClipboard(privateKey, copied, setCopied)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wallet;
