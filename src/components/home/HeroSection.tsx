"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Button } from "@/components/ui";
import { fadeUpAnimation } from "@/utils/animations";

const HeroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.section
      ref={ref}
      className="w-full flex flex-col text-center gap-10 items-center bg-primary p-16 rounded-4xl relative overflow-hidden before:content-[''] before:absolute before:top-0 before:right-0 before:size-32 before:bg-teal-500/10 before:rounded-bl-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:size-48 after:bg-teal-500/5 after:rounded-tr-full"
      {...fadeUpAnimation({ inView: isInView })}
    >
      <motion.h5
        className="bg-teal-500/20 px-3 py-2 rounded-full text-teal-800 dark:text-teal-200 font-medium text-sm leading-none"
        {...fadeUpAnimation({ delay: 0.1, inView: isInView })}
      >
        No Extensions · No Servers · 100% Yours
      </motion.h5>

      <motion.h1
        className="h1 -my-4"
        {...fadeUpAnimation({ delay: 0.2, inView: isInView })}
      >
        The Wallet That Lives in Your Browser
      </motion.h1>

      <motion.p
        className="text-lg max-w-3xl"
        {...fadeUpAnimation({ delay: 0.3, inView: isInView })}
      >
        Vaultic is a secure, browser-native crypto wallet for Solana and
        Ethereum. Generate and manage multiple accounts from a single recovery
        phrase — fully encrypted, open source, and under your complete control.
      </motion.p>

      <motion.div {...fadeUpAnimation({ delay: 0.4, inView: isInView })}>
        <Button as="link" href="/setup">
          Get Started
        </Button>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
