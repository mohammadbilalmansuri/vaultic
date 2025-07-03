"use client";
import { motion } from "motion/react";
import { useWalletStore } from "@/stores";
import { scaleUpAnimation } from "@/utils/animations";
import { PageShell } from "@/components/shells";
import { Button } from "@/components/ui";
import { QuestionMark } from "@/components/ui/icons";

const NotFound = () => {
  const walletExists = useWalletStore((state) => state.walletExists);
  const destination = walletExists ? "/dashboard" : "/";
  const label = walletExists ? "Dashboard" : "Home";

  return (
    <PageShell>
      <motion.div
        role="alert"
        aria-live="assertive"
        className="box gap-6 p-12 overflow-hidden"
        {...scaleUpAnimation()}
      >
        <QuestionMark className="w-15 text-yellow-500" aria-hidden="true" />
        <h1 className="h2">Page Not Found</h1>
        <p className="-mt-2">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          variant="zinc"
          as="link"
          href={destination}
          aria-label={`Go to ${label} page`}
        >
          Go to {label}
        </Button>
      </motion.div>
    </PageShell>
  );
};

export default NotFound;
