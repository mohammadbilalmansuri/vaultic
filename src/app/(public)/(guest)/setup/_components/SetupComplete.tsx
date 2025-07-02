"use client";
import { motion } from "motion/react";
import { TSetupPath } from "@/types";
import { scaleUpAnimation } from "@/utils/animations";
import { Button } from "@/components/ui";
import { Logo } from "@/components/ui/icons";

const SetupComplete = ({ path }: { path: TSetupPath }) => {
  return (
    <motion.div
      key="setup-complete"
      {...scaleUpAnimation({ duration: 0.15 })}
      className="box p-12"
    >
      <Logo className="w-15 text-teal-500" />
      <h2 className="mt-3">Your wallet is ready</h2>
      <p>
        You’ve successfully {path === "create" ? "created" : "imported"} your
        wallet. You’re now ready to explore, send, and manage your assets
        securely.
      </p>
      <Button as="link" href="/dashboard" className="mt-3">
        Enter Dashboard
      </Button>
    </motion.div>
  );
};

export default SetupComplete;
