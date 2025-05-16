"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ShieldTick, Wallet, Send, WalletMoney } from "@/components/ui/icons";
import { fadeUpAnimation } from "@/utils/animations";

const features = [
  {
    icon: ShieldTick,
    title: "Client-side Security Only",
    description:
      "Vaultic encrypts everything locally and stores it securely in your browser. Nothing ever leaves your device.",
  },
  {
    icon: Wallet,
    title: "One Phrase, Many Accounts",
    description:
      "From a single recovery phrase, create multiple accounts — each with its own Ethereum and Solana addresses, all managed together.",
  },
  {
    icon: Send,
    title: "Send ETH & SOL Instantly",
    description:
      "Transfer tokens on both mainnets and testnets. No browser extensions, no switching networks, no friction.",
  },
  {
    icon: WalletMoney,
    title: "Free Testnet Tokens",
    description:
      "Get SOL and ETH on testnets directly from your wallet using built-in airdrops and faucet integrations — no setup needed.",
  },
];

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section
      ref={ref}
      className="w-full relative flex flex-col items-center gap-8"
    >
      <motion.h2
        className="h2"
        {...fadeUpAnimation({ inView: isInView, delay: 0.5 })}
      >
        Built for Web3. Powered by You.
      </motion.h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
        {features.map(({ icon: Icon, title, description }, i) => (
          <motion.div
            key={`feature-${i}`}
            className="flex flex-col gap-4 p-8 rounded-3xl border-1.5 border-color"
            {...fadeUpAnimation({ inView: isInView, delay: 0.6 + i * 0.1 })}
          >
            <div className="flex items-center gap-4">
              <Icon className="w-8 text-teal-500" />
              <h3 className="text-h4 heading-color font-medium">{title}</h3>
            </div>
            <p>{description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
