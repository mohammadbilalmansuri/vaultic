"use client";
import { motion } from "motion/react";
import { Button } from "@/components/ui";
import { fadeUpAnimation } from "@/utils/animations";
import useUserStore from "@/stores/userStore";

const Hero = () => {
  const userExists = useUserStore((s) => s.userExists);

  return (
    <motion.section
      className="w-full flex flex-col text-center gap-10 items-center bg-primary p-16 rounded-4xl relative overflow-hidden before:content-[''] before:absolute before:top-0 before:right-0 before:size-32 before:bg-teal-500/10 before:rounded-bl-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:size-48 after:bg-teal-500/5 after:rounded-tr-full"
      {...fadeUpAnimation()}
    >
      <motion.span
        className="bg-teal-500/20 px-3 py-1.5 rounded-full text-teal-800 dark:text-teal-200 font-medium text-sm"
        {...fadeUpAnimation({ delay: 0.1 })}
      >
        Open Source & Non-Custodial
      </motion.span>

      <motion.h1 className="h1 -my-4" {...fadeUpAnimation({ delay: 0.2 })}>
        Secure by Design. Yours to Keep.
      </motion.h1>

      <motion.p
        className="text-lg max-w-3xl"
        {...fadeUpAnimation({ delay: 0.3 })}
      >
        Vaultic is a secure, browser-based crypto wallet for Solana and
        Ethereum. Create multiple wallets from one mnemonic, send assets on
        testnet and mainnet, and store everything encrypted — no servers, no
        compromise.
      </motion.p>

      <motion.div {...fadeUpAnimation({ delay: 0.4 })}>
        <Button as="link" href={userExists ? "/dashboard" : "/onboarding"}>
          {userExists ? "Go to Dashboard" : "Get Started"}
        </Button>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
