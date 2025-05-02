"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, EyeOff, BookKey, Code2, Lock, FolderKey } from "lucide-react";
import cn from "@/utils/cn";

const points = [
  {
    icon: Shield,
    title: "Local Encryption",
    description:
      "Vaultic encrypts your wallet data using your password. Nothing leaves your browser — ever.",
  },
  {
    icon: EyeOff,
    title: "No Backend, No Logs",
    description:
      "We don't store keys, passwords, or requests. No servers, no surveillance.",
  },
  {
    icon: BookKey,
    title: "Unified Recovery",
    description:
      "Manage both Solana and Ethereum wallets with a single mnemonic. Easily recoverable and portable.",
  },
  {
    icon: FolderKey,
    title: "HD Wallet Support",
    description:
      "Indexed wallets for both networks — fully hierarchical and deterministic.",
  },
  {
    icon: Code2,
    title: "100% Open Source",
    description:
      "Vaultic is open source and built transparently. Anyone can audit, fork, or contribute.",
  },
  {
    icon: Lock,
    title: "Privacy-First by Design",
    description:
      "From architecture to UI, Vaultic is built for local-first, secure-by-default crypto access.",
  },
];

const WhyVaultic = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="w-full py-10 flex flex-col gap-8">
      <div className="flex items-center justify-between gap-3 pl-1">
        <h2 className="text-3xl md:text-4xl font-bold heading-color">
          Why Vaultic?
        </h2>
        <p className="max-w-md pl-5 border-l-3 border-color">
          No middlemen. No backdoors. Vaultic is your secure, local-first crypto
          wallet — built to put you in control.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {points.map(({ icon: Icon, title, description }, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-start border border-color gap-5 p-8 rounded-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="bg-primary size-14 rounded-full flex items-center justify-center">
              <Icon className="w-6 text-teal-500" />
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

export default WhyVaultic;
