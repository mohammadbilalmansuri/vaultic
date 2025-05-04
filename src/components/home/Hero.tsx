"use client";
import { Button } from "@/components/ui";
import { motion } from "motion/react";

const Hero = () => {
  return (
    <section className="w-full relative flex gap-10 items-center">
      <div className="w-full sm:w-[55%] flex flex-col items-start gap-5">
        <motion.h1
          className="text-4xl md:text-5xl font-bold leading-snug heading-color"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Secure by design.
          <br />
          Yours by default.
        </motion.h1>

        <motion.p
          className="text-base md:text-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Create and manage Solana and Ethereum wallets with one secure phrase.
          No servers, no tracking — just your crypto, encrypted in your browser.
        </motion.p>

        <motion.div
          className="flex items-center gap-4 mt-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Button as="link" href="/onboarding">
            Get Started
          </Button>
          <Button as="link" href="/faucet" variant="zinc">
            Check Faucet
          </Button>
        </motion.div>
      </div>

      <motion.div
        className="w-full md:w-[45%] aspect-square relative flex items-center justify-center bg-[url(/hero-light.png)] dark:bg-[url(/hero-dark.png)] bg-no-repeat bg-contain bg-right"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      />
    </section>
  );
};

export default Hero;
