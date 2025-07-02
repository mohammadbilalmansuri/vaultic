"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { fadeUpAnimation } from "@/utils/animations";

const steps = [
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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section
      ref={ref}
      className="w-full relative flex flex-col items-center gap-8"
    >
      <motion.h2 className="h2" {...fadeUpAnimation({ inView })}>
        Set Up. Encrypt. Transact.
      </motion.h2>

      <div className="w-full relative grid grid-cols-1 md:grid-cols-3 gap-5">
        {steps.map(({ title, description }, i) => (
          <motion.div
            key={`step-${i}`}
            className="w-full relative flex flex-col items-start gap-3 border-1.5 border-color rounded-3xl overflow-hidden group"
            {...fadeUpAnimation({ inView, delay: 0.1 + i * 0.1 })}
          >
            <div className="w-full flex items-center justify-between pt-7 pl-8">
              <h3 className="h3">{title}</h3>
              <span className="text-xl font-medium leading-none border-y-1.5 border-l-1.5 border-color rounded-l-2xl pl-3 pr-2.5 py-2.5">
                0{i + 1}
              </span>
            </div>
            <p className="px-8 pb-8">{description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
