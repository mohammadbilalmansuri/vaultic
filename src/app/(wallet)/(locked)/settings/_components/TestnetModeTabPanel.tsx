"use client";
import { useTransition } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useWalletStore } from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { useBlockchain } from "@/hooks";
import { Switch } from "@/components/ui";

const TestnetModeTabPanel = () => {
  const networkMode = useWalletStore((state) => state.networkMode);
  const isTestnetModeOn = networkMode === "testnet";

  const { switchNetworkMode } = useBlockchain();
  const [switching, startSwitching] = useTransition();

  const handleSwitchNetworkMode = () => {
    startSwitching(switchNetworkMode);
  };

  return (
    <motion.div className="box max-w-lg" {...fadeUpAnimation()}>
      <div className="w-full flex items-center justify-between gap-3 pl-3.5 pr-3 py-3 border-b-1.5">
        <h3 className="xs:text-lg text-md font-medium text-primary">
          Testnet Mode
        </h3>
        <Switch
          state={isTestnetModeOn}
          onClick={handleSwitchNetworkMode}
          disabled={switching}
          className={cn({ "pointer-events-none": switching })}
        />
      </div>

      <div className="w-full flex flex-col items-center gap-3 xs:p-6 p-5">
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
          <Link href="/faucet" className="link">
            Get them from available faucets
          </Link>
          .
        </p>
      </div>
    </motion.div>
  );
};

export default TestnetModeTabPanel;
