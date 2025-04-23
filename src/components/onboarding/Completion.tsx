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
      <Logo className="-mt-1 w-18 fill-teal-500" />
      <h3 className="text-lg text-teal-500">Congratulations</h3>
      <h1>You're all ready!</h1>
      <p className="max-w-xs -mt-px">
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
