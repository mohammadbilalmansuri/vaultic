"use client";
import { motion } from "motion/react";
import { Button } from "@/components/ui";
import { Logo } from "@/components/ui/icons";

const Completion = () => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="box"
    >
      <Logo className="h-15 text-teal-500" />
      <h1 className="onboarding-heading mt-2">You're all ready!</h1>
      <p>
        Keep your Secret Recovery Phrase in a safe place. If you lose it, no one
        can recover it for you, and you will permanently lose access to your
        wallet.
      </p>
      <Button as="link" href="/dashboard" className="mt-3">
        Go to Dashboard
      </Button>
    </motion.div>
  );
};

export default Completion;
