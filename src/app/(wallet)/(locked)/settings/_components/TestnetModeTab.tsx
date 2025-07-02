"use client";
import { useTransition } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useWalletStore } from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { useBlockchain } from "@/hooks";
import { Switch } from "@/components/ui";

const TestnetModeTab = () => {
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

      <div className="flex flex-col gap-3 p-6 pt-5.5">
        <p>
          Testnet Mode provides a safe sandbox environment to explore Vaultic
          without any risk to your real crypto assets. When enabled, your wallet
          automatically connects to test networks (Solana Devnet and Ethereum
          Sepolia) instead of the main blockchain networks.
        </p>
        <p>
          You'll work with test tokens that have no real-world value, making it
          perfect for learning wallet operations, practicing transactions, and
          testing integrations. This risk-free environment is ideal for both
          newcomers getting familiar with crypto wallets and developers building
          applications.
        </p>
        <p className="mt-0.5">
          Need test tokens?{" "}
          <Link
            href="/faucet"
            className="heading-color border-b border-transparent hover:border-current transition-colors duration-300"
          >
            Get them from available faucets
          </Link>
          .
        </p>
      </div>
    </motion.div>
  );
};

export default TestnetModeTab;
