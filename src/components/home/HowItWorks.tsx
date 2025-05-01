"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  KeyRound,
  PlusCircle,
  SendHorizontal,
  LockKeyhole,
} from "lucide-react";

const steps = [
  {
    icon: <KeyRound className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
    title: "Set Your Password & Mnemonic",
    description:
      "Vaultic generates a secure mnemonic and encrypts it in your browser with your chosen password.",
  },
  {
    icon: (
      <PlusCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
    ),
    title: "Create Wallets Instantly",
    description:
      "Generate multiple Ethereum and Solana wallets from the same seed phrase — fully HD and indexed.",
  },
  {
    icon: (
      <SendHorizontal className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
    ),
    title: "Send Tokens Anywhere",
    description:
      "Transfer SOL or ETH on testnets or mainnets with one click. No setup, no complexity.",
  },
  {
    icon: (
      <LockKeyhole className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
    ),
    title: "Stay in Control",
    description:
      "Your data stays encrypted in your browser. No server, no tracking — fully self-custodial.",
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="w-full py-20 px-4 md:px-10 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800"
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-10 items-start">
        <motion.h2
          className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          How It Works
        </motion.h2>

        <div className="flex flex-col gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-4"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="flex-shrink-0">{step.icon}</div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
