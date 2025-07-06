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
      className="box gap-6 xs:py-12 xs:px-12 py-10 px-8"
    >
      <Logo className="box-icon text-teal-500" aria-hidden="true" />
      <h2>Your wallet is ready</h2>
      <p className="-mt-2">
        You’ve successfully {path === "create" ? "created" : "imported"} your
        wallet. You’re now ready to explore, send, and manage your assets
        securely.
      </p>
      <Button as="link" href="/dashboard">
        Enter Dashboard
      </Button>
    </motion.div>
  );
};

export default SetupComplete;
