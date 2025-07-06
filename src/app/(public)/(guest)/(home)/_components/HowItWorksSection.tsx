"use client";
import { motion } from "motion/react";
import { fadeUpAnimation } from "@/utils/animations";
import { useMotionInView } from "@/hooks";

const STEPS = [
  {
    title: "Create or Import",
    description:
      "Create a new wallet with a 12-word recovery phrase, or import an existing one. Vaultic uses BIP-39 to generate Solana and Ethereum addresses from a single mnemonic.",
  },
  {
    title: "Encrypt Locally",
    description:
      "Your recovery phrase is encrypted using your password with AES-GCM, and stored in your browser’s IndexedDB. Nothing ever leaves your device — not even for backup.",
  },
  {
    title: "Start Transacting",
    description:
      "Send and receive SOL or ETH on testnets and mainnets. Switch accounts and networks instantly. All in one place — no browser extensions required.",
  },
];

const HowItWorksSection = () => {
  const { ref, inView } = useMotionInView();

  return (
    <section
      ref={ref}
      role="region"
      aria-label="How Vaultic Works"
      className="w-full relative flex flex-col items-center lg:gap-8 md:gap-7 sm:gap-6 gap-5"
    >
      <motion.h2
        className="h2 text-center"
        {...fadeUpAnimation({ inView, delay: 0.05 })}
      >
        Set Up. Encrypt. Transact.
      </motion.h2>

      <div className="w-full relative grid grid-cols-1 md:grid-cols-3 sm:gap-5 gap-4">
        {STEPS.map(({ title, description }, index) => (
          <motion.div
            key={`step-${index}`}
            className="w-full relative border-1.5 border-color rounded-3xl overflow-hidden sm:pt-5 pt-4 sm:pl-6 pl-5 sm:pb-6 pb-5"
            {...fadeUpAnimation({ inView, delay: index * 0.05 + 0.1 })}
          >
            <div className="w-full flex items-center justify-between">
              <h3 className="h3">{title}</h3>
              <span
                className="flex items-center justify-center sm:size-10 size-9 sm:text-md font-medium leading-none border-y-1.5 border-l-1.5 border-color rounded-l-xl"
                aria-hidden="true"
              >
                0{index + 1}
              </span>
            </div>
            <p className="sm:pr-6 pr-5 md:pt-2 pt-1">{description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
