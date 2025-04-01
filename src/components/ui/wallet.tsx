"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Hide, Expand, Delete } from ".";
import { Solana, Ethereum } from "./icons";
import { useCopy, useWallet, useStorage } from "@/hooks";
import { IWallet } from "@/stores/walletStore";

const Wallet = ({
  name,
  index,
  network,
  address,
  privateKey,
  balance,
  isSingle,
}: IWallet & { name: string; isSingle: boolean }) => {
  const { deleteWallet } = useWallet();
  const { saveUser } = useStorage();
  const { copyToClipboard, copied } = useCopy();
  const [expanded, setExpanded] = useState(false);
  const [hidden, setHidden] = useState(true);

  const removeWallet = async () => {
    try {
      await deleteWallet(index, network);
      await saveUser();
    } catch (error) {
      console.error("Error deleting wallet:", error);
    }
  };

  return (
    <div className="w-full rounded-2xl relative p-5 flex flex-col transition-all duration-400 bg-zinc-200/60 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          {network === "solana" ? (
            <Solana className="size-10 bg-zinc-300/60 dark:bg-zinc-700/60 p-2.5 rounded-lg" />
          ) : (
            <Ethereum className="size-10 bg-zinc-300/60 dark:bg-zinc-700/60 p-2 rounded-lg" />
          )}

          <div className="flex flex-col gap-0.5">
            <h3 className="text-xl heading-color">{name}</h3>
            <p>{address}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <p className="heading-color leading-none">
            {balance} {network === "solana" ? "SOL" : "ETH"}
          </p>
          {!isSingle && expanded && <Delete onClick={removeWallet} />}
          <Expand
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
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden w-full flex flex-col gap-2"
          >
            <h4 className="pt-6 heading-color text-lg leading-none">
              Private Key
            </h4>

            <div className="w-full flex items-center justify-between gap-4 cursor-pointer">
              <p
                className="hover:heading-color transition-all duration-400"
                onClick={() => copyToClipboard(privateKey)}
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
                  onClick={() => copyToClipboard(privateKey)}
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
