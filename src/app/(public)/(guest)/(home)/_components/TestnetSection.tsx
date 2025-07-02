"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { fadeUpAnimation } from "@/utils/animations";
import { Button } from "@/components/ui";
import { Swap, WalletMoney } from "@/components/ui/icons";

const content = [
  {
    title: "Testnet Mode",
    paragraphs: [
      "Explore Vaultic with full functionality — safely. Testnet Mode mirrors your real wallet on Solana Devnet and Ethereum Sepolia, so you can experiment without risking real assets.",
      "Switch instantly — no RPC setup or configuration required. Perfect for learning, testing, or debugging before going live.",
    ],
    button: {
      text: "Set Up Wallet & Use Testnet",
      href: "/setup",
    },
    icon: Swap,
  },
  {
    title: "Get Testnet Tokens",
    paragraphs: [
      "Claim free SOL (Devnet) and ETH (Sepolia) to simulate transactions, test dApps, or explore blockchain basics — no wallet setup required.",
      "Vaultic includes a built-in faucet for Solana and a verified link to the official Sepolia faucet. Open to everyone — developers, testers, and curious beginners.",
    ],
    button: {
      text: "Visit Faucet",
      href: "/faucet",
    },
    icon: WalletMoney,
  },
];

const TestnetSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <section
      ref={ref}
      className="w-full relative flex flex-col items-center gap-8"
    >
      <motion.h2 className="h2" {...fadeUpAnimation({ inView })}>
        Test Freely. Learn Safely.
      </motion.h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
        {content.map(({ title, paragraphs, button, icon: Icon }, index) => (
          <motion.div
            key={index}
            className="w-full relative overflow-hidden flex flex-col items-start gap-4 p-8 border-1.5 border-color rounded-3xl"
            {...fadeUpAnimation({ inView, delay: index * 0.05 + 0.05 })}
          >
            <h3 className="h3 -mt-1">{title}</h3>
            {paragraphs.map((paragraph, j) => (
              <p key={j}>{paragraph}</p>
            ))}
            <Button
              as="link"
              href={button.href}
              size="sm"
              className="mt-2"
              variant="zinc"
            >
              {button.text}
            </Button>
            <span className="absolute right-0 bottom-0 size-24 rounded-tl-full flex items-end justify-end pr-4 pb-4 bg-primary">
              <Icon className="w-10 text-zinc-500" />
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TestnetSection;
