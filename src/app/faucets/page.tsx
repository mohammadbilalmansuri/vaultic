"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { Logo, Solana, Ethereum } from "@/components/ui/icons";

const Faucets = () => {
  const [faucet, setFaucet] = useState<"solana" | "ethereum" | null>(null);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="box"
    >
      <h1>Available Faucets</h1>
      <p className="-mt-1">On which network do you want airdrop test tokens</p>

      <div className="flex flex-col gap-4 pt-2">
        <Button
          variant="zinc"
          className="gap-2.5"
          onClick={() => setFaucet("solana")}
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

export default Faucets;
