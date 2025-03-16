"use client";
import { useState, MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui";
import { useWallet, useStorage } from "@/hooks";
import { useWalletStore } from "@/stores/walletStore";
import Wallet from "./Wallet";
import { SolanaIcon, EthereumIcon } from "../ui/icons";
import { TNetwork } from "@/stores/userStore";

const Wallets = () => {
  const wallets = useWalletStore((state) => state.wallets);
  const { createWallet } = useWallet();
  const { saveUser } = useStorage();
  const [isAddingNewWallet, setIsAddingNewWallet] = useState(false);

  const addWallet = async (network: TNetwork) => {
    await createWallet(network);
    await saveUser();
    setIsAddingNewWallet(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.6, ease: "easeOut" }}
      className="w-full flex flex-col gap-5 px-1 pt-2"
    >
      <div className="w-full flex items-center justify-between">
        <h2 className="text-2xl heading-color">Your Wallets</h2>

        <div className="flex items-center gap-3">
          {isAddingNewWallet ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                className="size-10 cursor-pointer icon"
                onClick={() => setIsAddingNewWallet(false)}
              >
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
              <SolanaIcon
                className="size-10 bg-zinc-200 dark:bg-zinc-800 p-2.5 rounded-lg cursor-pointer"
                onClick={() => addWallet("solana")}
              />
              <EthereumIcon
                className="size-10 bg-zinc-200 dark:bg-zinc-800 p-2 rounded-lg cursor-pointer"
                onClick={() => addWallet("ethereum")}
              />
            </>
          ) : (
            <Button
              className="h-10 px-3"
              onClick={() => setIsAddingNewWallet(true)}
            >
              Add new wallet
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        <div className="w-full flex flex-col gap-5">
          {wallets.map((wallet, index) => (
            <Wallet
              key={wallet.address}
              {...wallet}
              name={`Wallet ${index + 1}`}
            />
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  );
};

export default Wallets;
