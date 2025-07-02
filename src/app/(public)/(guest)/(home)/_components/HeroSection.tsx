"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { fadeUpAnimation } from "@/utils/animations";
import { Button } from "@/components/ui";

const HeroSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.section ref={ref} className="hero" {...fadeUpAnimation({ inView })}>
      <motion.h5
        className="hero-subtext"
        {...fadeUpAnimation({ delay: 0.1, inView })}
      >
        No Extensions · No Servers · 100% Yours
      </motion.h5>

      <motion.h1 className="h1" {...fadeUpAnimation({ delay: 0.2, inView })}>
        The Wallet That Lives in Your Browser
      </motion.h1>

      <motion.p
        className="hero-paragraph"
        {...fadeUpAnimation({ delay: 0.3, inView })}
      >
        Vaultic is a secure, browser-native crypto wallet for Solana and
        Ethereum. Generate and manage multiple accounts from a single recovery
        phrase — fully encrypted, open source, and under your complete control.
      </motion.p>

      <motion.div {...fadeUpAnimation({ delay: 0.4, inView })}>
        <Button as="link" href="/setup">
          Get Started
        </Button>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
