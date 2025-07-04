"use client";
import { motion } from "motion/react";
import { IN_VIEW_OPTIONS } from "@/constants";
import { TIcon } from "@/types";
import { fadeUpAnimation } from "@/utils/animations";
import { useMotionInView } from "@/hooks";
import {
  ShieldTick,
  Wallet,
  Send,
  WalletMoney,
  WalletRecovery,
  Code,
} from "@/components/ui/icons";

interface IFeature {
  Icon: TIcon;
  title: string;
  description: string;
}

const features: IFeature[] = [
  {
    Icon: ShieldTick,
    title: "Fully Encrypted, Fully Local",
    description:
      "Vaultic runs entirely in your browser. Your recovery phrase and wallets are encrypted using AES-GCM and never leave your device — ever.",
  },
  {
    Icon: Wallet,
    title: "One Phrase. Infinite Possibilities.",
    description:
      "Generate multiple Solana and Ethereum accounts from a single seed phrase. No need to manage multiple wallets — everything stays in sync.",
  },
  {
    Icon: Send,
    title: "Frictionless ETH & SOL Transfers",
    description:
      "Send and receive assets on mainnet and testnet instantly. No browser extensions, no network configs — just type, confirm, and go.",
  },
  {
    Icon: WalletMoney,
    title: "Test with Real Tools, Not Real Risk",
    description:
      "Claim free testnet ETH and SOL directly in the interface. Perfect for development, debugging, and demos without touching real funds.",
  },
  {
    Icon: WalletRecovery,
    title: "Recoverable Anywhere",
    description:
      "Your recovery phrase is all you need. Re-import your wallets on any device — Vaultic will regenerate every account deterministically.",
  },
  {
    Icon: Code,
    title: "100% Open Source & Auditable",
    description:
      "Every line of Vaultic is public and verifiable. Whether you’re a dev or a security expert, you’re welcome to inspect, fork, and improve it.",
  },
];

const FeatureCard = ({ Icon, title, description }: IFeature) => {
  const { ref, inView } = useMotionInView<HTMLDivElement>(IN_VIEW_OPTIONS);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col gap-3 lg:p-8 sm:p-5.5 p-4.5 rounded-3xl border-1.5 border-color"
      {...fadeUpAnimation({ inView })}
    >
      <div className="flex items-center lg:gap-4 md:gap-3.5 gap-2.5">
        <Icon className="lg:w-8 md:w-7 w-6 text-teal-500" aria-hidden="true" />
        <h3 className="h3">{title}</h3>
      </div>
      <p>{description}</p>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const { ref, inView } = useMotionInView<HTMLHeadingElement>(IN_VIEW_OPTIONS);

  return (
    <section
      role="region"
      aria-label="Features section"
      className="w-full relative flex flex-col items-center lg:gap-8 md:gap-7 sm:gap-6 xs:gap-5 gap-4"
    >
      <motion.h2
        ref={ref}
        className="h2 text-center"
        {...fadeUpAnimation({ inView })}
      >
        Everything You Need.{" "}
        <span className="text-nowrap">Nothing You Don’t.</span>
      </motion.h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:gap-5 sm:gap-4.5 gap-3.5">
        {features.map((feature, index) => (
          <FeatureCard key={`feature-${index}`} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
