"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import getFadeUpAnimation from "@/utils/getFadeUpAnimation";

const steps = [
  {
    title: "Generate Your Wallet",
    description:
      "Create a new 12-word seed phrase or import one you already use. Vaultic generates Solana and Ethereum wallets from a single mnemonic — fully BIP-39 compliant for compatibility.",
  },
  {
    title: "Encrypt & Secure",
    description:
      "Set a strong password to encrypt everything using AES-256. Your wallet data stays in your browser's local storage — never sent to any server.",
  },
  {
    title: "Manage & Transact",
    description:
      "Send, receive, and manage assets with ease. Switch between Ethereum and Solana mainnets or testnets — all in one clean interface.",
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="w-full relative flex flex-col items-center gap-8"
    >
      <motion.h2
        className="h2"
        {...getFadeUpAnimation({ inView: isInView, delay: 0.3 })}
      >
        Create. Encrypt. Transact.
      </motion.h2>

      <div className="w-full relative grid grid-cols-3 gap-5">
        {steps.map(({ title, description }, i) => (
          <motion.div
            key={`step-${i}`}
            className="w-full relative flex flex-col items-start gap-5 border-1.5 border-color p-7 rounded-3xl overflow-hidden group"
            {...getFadeUpAnimation({ inView: isInView, delay: 0.4 + i * 0.1 })}
          >
            <h3 className="text-h3 font-medium heading-color -mt-1">{title}</h3>
            <p className="-mt-2">{description}</p>
            <span className="absolute right-0 bottom-0 text-xl font-medium leading-none size-14 rounded-tl-full flex items-end justify-end pr-3 pb-3 transition-all duration-300 text-teal-500 bg-teal-500/10 dark:bg-teal-500/5">
              0{i + 1}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
