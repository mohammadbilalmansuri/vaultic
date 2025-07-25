"use client";
import { motion } from "motion/react";
import { fadeUpAnimation } from "@/utils/animations";
import { useMotionInView } from "@/hooks";
import { Button } from "@/components/ui";

const HeroSection = () => {
  const { ref, inView } = useMotionInView();

  return (
    <motion.section
      ref={ref}
      role="region"
      aria-label="Hero Section"
      className="hero"
      {...fadeUpAnimation({ inView })}
    >
      <p className="min-w-max sm:px-2.5 sm:py-2 px-2 py-1.5 sm:text-sm text-xs rounded-lg font-medium leading-none border highlight-teal">
        No Extensions &#8226; No Servers &#8226; 100% Yours
      </p>

      <h1 className="h1">The Wallet That Lives in Your Browser</h1>

      <p className="md:text-lg sm:text-md text-base md:max-w-3xl sm:-mt-2 -mt-1.5 mb-1">
        Vaultic is a secure, browser-native crypto wallet for Solana and
        Ethereum. Generate and manage multiple accounts from a single recovery
        phrase — fully encrypted, open source, and under your complete control.
      </p>

      <Button
        as="link"
        href="/setup"
        aria-label="Get started with Vaultic wallet setup"
      >
        Get Started
      </Button>
    </motion.section>
  );
};

export default HeroSection;
