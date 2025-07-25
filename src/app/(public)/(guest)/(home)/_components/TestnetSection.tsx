"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { fadeUpAnimation } from "@/utils/animations";
import { useMotionInView } from "@/hooks";
import { ArrowRight } from "@/components/icons";
import { Tooltip } from "@/components/ui";

const CONTENTS = [
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
    link: { text: "Set Up Wallet & Use Testnet", href: "/setup" },
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
    link: { text: "Visit Faucet", href: "/faucet" },
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
      <motion.h2
        className="h2 text-center"
        {...fadeUpAnimation({ inView, delay: 0.05 })}
      >
        Test Freely. Learn Safely.
      </motion.h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 md:gap-5 gap-4">
        {CONTENTS.map(({ title, paragraphs, link }, index) => (
          <motion.div
            key={`content-${index}`}
            aria-label={title}
            className="w-full relative border-1.5 rounded-3xl flex flex-col items-start sm:gap-2 gap-1.5 sm:pl-6 sm:pb-6 sm:pt-4 sm:pr-4 pl-5 pb-5 pt-3.5 pr-3.5"
            {...fadeUpAnimation({ inView, delay: index * 0.05 + 0.1 })}
          >
            <div className="w-full relative flex items-center-safe justify-between gap-3">
              <h3 className="h3">{title}</h3>
              <Tooltip content={link.text} position="left">
                <Link
                  href={link.href}
                  className="icon-btn-bg"
                  aria-label={link.text}
                >
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
