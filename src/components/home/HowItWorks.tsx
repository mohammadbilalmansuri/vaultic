"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { fadeUpAnimation } from "@/utils/animations";

const steps = [
  {
    title: "Create or Import",
    description:
      "Start with a new 12-word recovery phrase or import an existing one. Vaultic generates Solana and Ethereum accounts from a single mnemonic using industry-standard BIP-39.",
  },
  {
    title: "Encrypt with a Password",
    description:
      "Secure your wallets using AES-GCM encryption. All data is stored locally in your browser using IndexedDB — fully offline and private.",
  },
  {
    title: "Transact Seamlessly",
    description:
      "Send and receive ETH and SOL across mainnets and testnets. Switch networks or accounts instantly with a single unified interface.",
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section
      ref={ref}
      className="w-full relative flex flex-col items-center gap-8"
    >
      <motion.h2 className="h2" {...fadeUpAnimation({ inView: isInView })}>
        Create. Encrypt. Transact.
      </motion.h2>

      <div className="w-full relative grid grid-cols-3 gap-5">
        {steps.map(({ title, description }, i) => (
          <motion.div
            key={`step-${i}`}
            className="w-full relative flex flex-col items-start gap-5 border-1.5 border-color p-8 rounded-3xl overflow-hidden group"
            {...fadeUpAnimation({ inView: isInView, delay: 0.1 + i * 0.1 })}
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
