"use client";
import { motion } from "motion/react";
import { fadeUpAnimation } from "@/utils/animations";
import { useMatchMedia, useMotionInView } from "@/hooks";
import {
  ShieldTick,
  Wallet,
  Send,
  WalletMoney,
  WalletRecovery,
  Code,
} from "@/components/ui/icons";

const features = [
  {
    icon: ShieldTick,
    title: "Fully Encrypted, Fully Local",
    description:
      "Vaultic runs entirely in your browser. Your recovery phrase and wallets are encrypted using AES-GCM and never leave your device — ever.",
  },
  {
    icon: Wallet,
    title: "One Phrase. Infinite Possibilities.",
    description:
      "Generate multiple Solana and Ethereum accounts from a single seed phrase. No need to manage multiple wallets — everything stays in sync.",
  },
  {
    icon: Send,
    title: "Frictionless ETH & SOL Transfers",
    description:
      "Send and receive assets on mainnet and testnet instantly. No browser extensions, no network configs — just type, confirm, and go.",
  },
  {
    icon: WalletMoney,
    title: "Test with Real Tools, Not Real Risk",
    description:
      "Claim free testnet ETH and SOL directly in the interface. Perfect for development, debugging, and demos without touching real funds.",
  },
  {
    icon: WalletRecovery,
    title: "Recoverable Anywhere",
    description:
      "Your recovery phrase is all you need. Re-import your wallets on any device — Vaultic will regenerate every account deterministically.",
  },
  {
    icon: Code,
    title: "100% Open Source & Auditable",
    description:
      "Every line of Vaultic is public and verifiable. Whether you’re a dev or a security expert, you’re welcome to inspect, fork, and improve it.",
  },
];

const FeaturesSection = () => {
  const isLowHeight = useMatchMedia("(max-height: 800px)");
  const { ref, inView } = useMotionInView({
    once: true,
    amount: isLowHeight ? 0.1 : 0.25,
  });

  return (
    <section
      ref={ref}
      role="region"
      aria-label="Features section"
      className="w-full relative flex flex-col items-center lg:gap-8 md:gap-7 sm:gap-6 xs:gap-5 gap-4"
    >
      <motion.h2 className="h2 text-center" {...fadeUpAnimation({ inView })}>
        Everything You Need.{" "}
        <span className="text-nowrap">Nothing You Don’t.</span>
      </motion.h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:gap-5 sm:gap-4.5 gap-3.5">
        {features.map(({ icon: Icon, title, description }, index) => (
          <motion.div
            key={`feature-${index}`}
            className="flex flex-col md:gap-4 gap-3 lg:p-8 sm:p-5.5 p-4.5 rounded-3xl border-1.5 border-color"
            {...fadeUpAnimation({ inView, delay: index * 0.05 + 0.05 })}
          >
            <div className="flex items-center lg:gap-4 md:gap-3.5 gap-2.5">
              <Icon
                className="lg:w-8 md:w-7 w-6 text-teal-500"
                aria-hidden="true"
                focusable="false"
              />
              <h3 className="h3">{title}</h3>
            </div>
            <p>{description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
