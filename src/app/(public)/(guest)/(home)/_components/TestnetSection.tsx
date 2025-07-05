"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { fadeUpAnimation } from "@/utils/animations";
import { useMotionInView } from "@/hooks";
import { Tooltip } from "@/components/ui";
import { ArrowRight } from "@/components/ui/icons";

const content = [
  {
    title: "Testnet Mode",
    paragraphs: (
      <>
        <p>
          Explore Vaultic with full functionality — safely and risk-free.
          Testnet Mode creates a mirror of your real wallet using Solana Devnet
          and Ethereum Sepolia, so you can test, learn, and experiment without
          touching real assets.
        </p>
        <p>
          No setup. No configuration. Just switch instantly. It’s ideal for
          learning, debugging, or trial runs before going live.
        </p>
      </>
    ),
    button: { text: "Set Up Wallet & Use Testnet", href: "/setup" },
  },
  {
    title: "Get Testnet Tokens",
    paragraphs: (
      <>
        <p>
          Get free test tokens — no wallet setup needed. Claim SOL (Devnet) and
          ETH (Sepolia) to try transactions, test dApps, or just explore how
          blockchain works.
        </p>
        <p>
          Vaultic includes a built-in Solana faucet and a trusted link to the
          official Sepolia one. Open to everyone — developers, testers, and
          curious beginners alike.
        </p>
      </>
    ),
    button: { text: "Visit Faucet", href: "/faucet" },
  },
];

const TestnetSection = () => {
  const { ref, inView } = useMotionInView();

  return (
    <section
      ref={ref}
      role="region"
      aria-label="Testnet features"
      className="w-full relative flex flex-col items-center lg:gap-8 md:gap-7 sm:gap-6 gap-5"
    >
      <motion.h2 className="h2 text-center" {...fadeUpAnimation({ inView })}>
        Test Freely. Learn Safely.
      </motion.h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 sm:gap-5 gap-4">
        {content.map(({ title, paragraphs, button }, index) => (
          <motion.div
            key={index}
            aria-label={title}
            className="w-full relative border-1.5 border-color rounded-3xl flex flex-col items-start sm:gap-2 gap-1.5 sm:pl-6 sm:pb-6 sm:pt-4 sm:pr-4 pl-5 pb-5 pt-3.5 pr-3.5"
            {...fadeUpAnimation({ inView, delay: index * 0.05 + 0.05 })}
          >
            <div className="w-full relative flex items-center-safe justify-between gap-3">
              <h3 className="h3">{title}</h3>
              <Tooltip content={button.text} position="left">
                <Link href={button.href} className="icon-btn-bg">
                  <ArrowRight />
                </Link>
              </Tooltip>
            </div>
            <div className="w-full relative flex flex-col sm:gap-3 gap-2.5 pr-2">
              {paragraphs}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TestnetSection;
