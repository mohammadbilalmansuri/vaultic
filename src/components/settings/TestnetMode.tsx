"use client";
import { useTransition } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useWalletStore } from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { useBlockchain } from "@/hooks";
import { Switch } from "../ui";

const TestnetMode = () => {
  const networkMode = useWalletStore((state) => state.networkMode);
  const isTestnetModeOn = networkMode === "testnet";

  const { switchNetworkMode } = useBlockchain();
  const [switching, startSwitching] = useTransition();

  const handleSwitchNetworkMode = () => {
    startSwitching(async () => await switchNetworkMode());
  };

  return (
    <motion.div className="box max-w-lg gap-0" {...fadeUpAnimation()}>
      <div className="w-full flex items-center justify-between gap-4 pl-4 pr-3 py-3 border-b-1.5 border-color">
        <h3 className="text-lg font-medium heading-color">Testnet Mode</h3>
        <Switch
          state={isTestnetModeOn}
          onClick={handleSwitchNetworkMode}
          disabled={switching}
          className={cn(switching ? "pointer-events-none" : "")}
        />
      </div>

      <div className="flex flex-col gap-4 p-6 pt-5.5">
        <p>
          Testnet Mode lets you explore Vaultic in a safe environment without
          risking real assets. While it’s enabled, your wallet connects to
          Solana Devnet and Ethereum Sepolia — public test networks designed for
          experimentation.
        </p>
        <p>
          You’ll interact with test tokens and simulated balances, allowing you
          to learn the wallet flow, try transactions, or test integration
          behavior — ideal for first-time users and developers.
        </p>
        <p>
          Need test tokens?{" "}
          <Link
            href="/faucet"
            className="heading-color border-b border-transparent hover:border-current transition-colors duration-300"
          >
            Check available faucets
          </Link>
          .
        </p>
      </div>
    </motion.div>
  );
};

export default TestnetMode;
