"use client";
import { useState, useTransition } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui";
import { Solana, Ethereum } from "@/components/ui/icons";
import { useBlockchain } from "@/hooks";
import useNotificationStore from "@/stores/notificationStore";
import { useForm } from "react-hook-form";

const SolanaFaucet = () => {
  const { airdropSolana } = useBlockchain();
  const notify = useNotificationStore((state) => state.notify);
  const [airdroping, startAirdroping] = useTransition();

  const handleAirdrop = async ({
    address,
    amount,
  }: {
    address: string;
    amount: string;
  }) => {
    startAirdroping(async () => {
      try {
        await airdropSolana(address, amount);
        notify({
          type: "success",
          message: "Airdrop successful!",
        });
      } catch (error) {
        const err = error as Error;

        if (
          err.message.includes("limit") ||
          err.message.includes("rate limit")
        ) {
          notify({
            type: "error",
            message: "Airdrop limit reached. Please try after 24 hours.",
          });
        } else {
          notify({
            type: "error",
            message: "Airdrop failed. Please try again.",
          });
        }
      }
    });
  };

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
        <Button variant="zinc" className="gap-2.5">
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

export default SolanaFaucet;
