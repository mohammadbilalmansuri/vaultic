"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { fadeUpAnimation } from "@/utils/animations";
import { Button } from "@/components/ui";

const HeroSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.section ref={ref} className="hero" {...fadeUpAnimation({ inView })}>
      <h5 className="hero-subtext">No Extensions · No Servers · 100% Yours</h5>
      <h1 className="h1">The Wallet That Lives in Your Browser</h1>
      <p className="hero-paragraph">
        Vaultic is a secure, browser-native crypto wallet for Solana and
        Ethereum. Generate and manage multiple accounts from a single recovery
        phrase — fully encrypted, open source, and under your complete control.
      </p>
      <Button as="link" href="/setup">
        Get Started
      </Button>
    </motion.section>
  );
};

export default HeroSection;
