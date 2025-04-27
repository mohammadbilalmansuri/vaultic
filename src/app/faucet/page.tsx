"use client";
import { motion } from "motion/react";
import { Button } from "@/components/ui";
import { Solana, Ethereum } from "@/components/ui/icons";

const Faucet = () => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="box"
    >
      <h1>Request Test Tokens</h1>
      <p className="max-w-sm">
        Choose a blockchain network below to receive testnet tokens for
        development and testing purposes.
      </p>

      <div className="flex flex-col gap-4">
        <Button
          variant="zinc"
          as="link"
          href="/faucet/solana"
          className="gap-2.5"
        >
          <Solana className="h-4 min-w-fit" />
          <span className="mt-px">Solana Devnet</span>
        </Button>

        <Button
          variant="zinc"
          as="link"
          href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
          target="_blank"
          className="gap-2.5"
        >
          <Ethereum className="h-6 min-w-fit" />
          <span className="mt-px">Ethereum Sepolia</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default Faucet;
