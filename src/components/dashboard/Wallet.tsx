"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy } from "../ui";
import { SolanaIcon, EthereumIcon, Hide } from "../ui/icons";
import { useCopy, useWallet, useStorage } from "@/hooks";
import { IWallet } from "@/stores/walletStore";

const Wallet = ({
  name,
  index,
  network,
  address,
  privateKey,
  balance,
}: IWallet & { name: string }) => {
  const { deleteWallet } = useWallet();
  const { saveUser } = useStorage();
  const { copyToClipboard, copied } = useCopy();
  const [expanded, setExpanded] = useState(false);
  const [hidden, setHidden] = useState(true);

  const removeWallet = async () => {
    await deleteWallet(index, network);
    await saveUser();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full border-2 border-color rounded-lg relative p-5 flex flex-col"
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          {network === "solana" ? (
            <SolanaIcon className="size-10 bg-zinc-200 dark:bg-zinc-800 p-2.5 rounded-lg" />
          ) : (
            <EthereumIcon className="size-10 bg-zinc-200 dark:bg-zinc-800 p-2 rounded-lg" />
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
          {expanded && (
            <button
              key="remove-wallet"
              className="icon transition-none"
              onClick={removeWallet}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
              </svg>
            </button>
          )}

          <button className="icon" onClick={() => setExpanded((prev) => !prev)}>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
            </motion.svg>
          </button>
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
                className="hover:heading-color transition-all duration-200"
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
    </motion.div>
  );
};

export default Wallet;
