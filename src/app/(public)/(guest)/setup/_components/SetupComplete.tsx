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
      aria-label="Setup Complete Step"
      className="box without-progress"
      {...scaleUpAnimation({ duration: 0.15 })}
    >
      <Logo className="box-icon text-teal-500" aria-hidden="true" />
      <h1>Your wallet is ready</h1>
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
