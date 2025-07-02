"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { fadeUpAnimation } from "@/utils/animations";
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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <section
      ref={ref}
      role="region"
      aria-label="Features section"
      className="w-full relative flex flex-col items-center gap-8"
    >
      <motion.h2 className="h2" {...fadeUpAnimation({ inView })}>
        Everything You Need. Nothing You Don’t.
      </motion.h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
        {features.map(({ icon: Icon, title, description }, index) => (
          <motion.div
            key={`feature-${index}`}
            className="flex flex-col gap-4 p-8 rounded-3xl border-1.5 border-color"
            {...fadeUpAnimation({ inView, delay: index * 0.05 + 0.05 })}
          >
            <div className="flex items-center gap-4">
              <Icon
                className="w-8 text-teal-500"
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
