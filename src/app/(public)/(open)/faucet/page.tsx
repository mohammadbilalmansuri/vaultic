"use client";
import { motion } from "motion/react";
import { Button } from "@/components/ui";
import { Solana, Ethereum, Logo } from "@/components/ui/icons";
import { scaleUpAnimation } from "@/utils/animations";

const Faucet = () => {
  return (
    <motion.div {...scaleUpAnimation()} className="box">
      <Logo className="w-15 text-teal-500" />
      <h1 className="box-heading mt-2">Get Testnet Tokens</h1>
      <p>
        Select a supported network to request free tokens for testing and
        development purposes.
      </p>

      <div className="flex flex-col items-center gap-4 mt-3">
        <Button
          variant="zinc"
          as="link"
          href="/faucet/solana"
          className="gap-2.5 w-full"
        >
          <Solana className="h-4 min-w-fit" />
          <span className="mt-px">Solana Devnet</span>
        </Button>

        <Button
          variant="zinc"
          as="link"
          href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
          rel="noopener noreferrer"
          target="_blank"
          className="gap-2.5 w-full"
        >
          <Ethereum className="h-6 min-w-fit" />
          <span className="mt-px">Ethereum Sepolia</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default Faucet;
