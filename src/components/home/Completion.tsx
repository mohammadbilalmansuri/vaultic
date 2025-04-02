"use client";
import { motion } from "motion/react";
import { Button } from "@/components/ui";
import { Logo } from "../ui/icons";

const Completion = () => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="box"
    >
      <Logo size="lg" className="-mt-1" />
      <h3 className="text-lg text-teal-500">Congratulations</h3>
      <h1>You're all good!</h1>
      <p className="max-w-xs">
        Keep a reminder of your Secret Recovery Phrase somewhere safe. If you
        lose it, no one can help you get it back. Even worse, you won't be able
        to access your wallet ever again.
      </p>

      <Button as="link" href="/dashboard" className="mt-2">
        Open Vaultic
      </Button>
    </motion.div>
  );
};

export default Completion;
