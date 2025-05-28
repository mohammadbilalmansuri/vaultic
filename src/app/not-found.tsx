"use client";
import { motion } from "motion/react";
import { useWalletStore } from "@/stores";
import { PageShell } from "@/components/shells";
import { Button } from "@/components/ui";
import { QuestionMark } from "@/components/ui/icons";
import { scaleUpAnimation } from "@/utils/animations";

const NotFound = () => {
  const walletExists = useWalletStore((state) => state.walletExists);

  return (
    <PageShell>
      <motion.div {...scaleUpAnimation()} className="box p-12 overflow-hidden">
        <QuestionMark className="w-15 text-yellow-500" />
        <h2 className="mt-3">Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Button
          variant="zinc"
          as="link"
          href={walletExists ? "/dashboard" : "/"}
          className="mt-3"
        >
          Go to {walletExists ? "Dashboard" : "Home"}
        </Button>
      </motion.div>
    </PageShell>
  );
};

export default NotFound;
