"use client";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ShieldTick, Wallet, Send, WalletMoney } from "@/components/ui/icons";

const features = [
  {
    icon: ShieldTick,
    title: "Client-side Security Only",
    description:
      "Vaultic stores your wallets in your browser using end-to-end encryption — nothing ever touches a server.",
  },
  {
    icon: Wallet,
    title: "One Seed, Many Wallets",
    description:
      "Generate multiple Ethereum and Solana wallets from a single recovery phrase with full HD wallet indexing.",
  },
  {
    icon: Send,
    title: "Send ETH & SOL Instantly",
    description:
      "Transfer tokens across both mainnets and testnets — no extensions, network switching, or friction.",
  },
  {
    icon: WalletMoney,
    title: "Get Free Testnet Tokens",
    description:
      "Access Solana Devnet airdrops and trusted Sepolia faucets to safely test and simulate real transactions — no real funds needed.",
  },
];

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="w-full relative flex flex-col items-center gap-10"
    >
      <motion.h2
        className="text-3xl md:text-4xl font-bold heading-color leading-snug"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        What Vaultic Offers
      </motion.h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
        {features.map(({ icon: Icon, title, description }, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-5 py-7 px-5 rounded-3xl border-1.5 border-color"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
          >
            <div>
              <Icon className="w-10 text-teal-500" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-medium heading-color">{title}</h3>
              <p>{description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
