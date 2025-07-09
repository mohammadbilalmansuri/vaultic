"use client";
import { motion } from "motion/react";
import { scaleUpAnimation } from "@/utils/animations";
import { Solana, Ethereum, Logo } from "@/components/icons";
import { Button } from "@/components/ui";

const FaucetPage = () => {
  return (
    <motion.div
      aria-label="Faucet Resources"
      className="box without-progress"
      {...scaleUpAnimation()}
    >
      <Logo className="icon-lg text-teal-500" aria-hidden="true" />
      <h1 className="xxs:text-nowrap">Claim Free Testnet Tokens</h1>
      <p className="-mt-2.5">
        Get free ETH (Sepolia) and SOL (Devnet) for testing, development, or
        exploring blockchain features. Perfect for simulating transactions and
        experimenting safely on testnets.
      </p>
      <div className="flex flex-col items-center sm:gap-4 gap-3">
        <Button
          variant="zinc"
          as="link"
          href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
          rel="noopener noreferrer"
          target="_blank"
          className="w-full"
        >
          <Ethereum className="sm:h-6 h-5.5 shrink-0" />
          <span className="mt-px">Ethereum Sepolia</span>
        </Button>
        <Button
          variant="zinc"
          as="link"
          href="/faucet/solana"
          className="w-full"
        >
          <Solana className="sm:h-4 h-3.5 shrink-0" />
          <span className="mt-px">Solana Devnet</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default FaucetPage;
