"use client";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ShieldTick, Wallet, Send, Airdrop } from "@/components/ui/icons";

const features = [
  {
    icon: ShieldTick,
    title: "No Backend, Fully Encrypted",
    description:
      "All your data is stored securely in your browser using encryption. Nothing ever touches our servers.",
  },
  {
    icon: Wallet,
    title: "One Mnemonic, Multiple Wallets",
    description:
      "Create unlimited Solana and Ethereum wallets from a single recovery phrase with full HD wallet support.",
  },
  {
    icon: Send,
    title: "Send SOL & ETH",
    description:
      "Transfer tokens seamlessly on both mainnet and testnet networks, right from your browser.",
  },
  {
    icon: Airdrop,
    title: "Testnet Faucet & Dev Tools",
    description:
      "A built-in Solana devnet faucet and links to ETH Sepolia faucets to help you test without limits.",
  },
];

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="w-full relative flex flex-col items-center gap-10 py-20"
    >
      <motion.h2
        className="text-3xl md:text-4xl font-bold heading-color"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
      >
        What Vaultic Offers
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {features.map(({ icon: Icon, title, description }, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-5 py-7 px-5 rounded-3xl bg-primary"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.2 }}
          >
            <div>
              <Icon className="w-10 stroke-teal-500" />
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
