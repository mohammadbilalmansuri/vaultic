"use client";
import { motion } from "motion/react";
import { TSetupPath } from "@/types";
import { scaleUpAnimation } from "@/utils/animations";
import { Logo } from "@/components/icons";
import { Button } from "@/components/ui";

const SetupComplete = ({ path }: { path: TSetupPath }) => {
  return (
    <motion.div
      key="setup-complete"
      aria-label="Setup Complete"
      className="box without-progress"
      {...scaleUpAnimation({ duration: 0.15 })}
    >
      <Logo className="icon-lg text-teal-500" aria-hidden="true" />
      <h1>Your Wallet Is Ready</h1>
      <p className="-mt-2.5">
        You’ve successfully {path === "create" ? "created" : "imported"} your
        wallet. You’re now ready to explore, send, and manage your assets
        securely.
      </p>
      <Button as="link" href="/dashboard">
        Go to Dashboard
      </Button>
    </motion.div>
  );
};

export default SetupComplete;
