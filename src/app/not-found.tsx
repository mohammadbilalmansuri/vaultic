"use client";
import { motion } from "motion/react";
import { useWalletStore } from "@/stores";
import { scaleUpAnimation } from "@/utils/animations";
import { QuestionMark } from "@/components/icons";
import { PageLayout } from "@/components/layouts";
import { Button } from "@/components/ui";

const NotFound = () => {
  const walletExists = useWalletStore((state) => state.walletExists);
  const destination = walletExists ? "/dashboard" : "/";
  const label = walletExists ? "Dashboard" : "Home";

  return (
    <PageLayout>
      <div className="box-page" aria-label="Not Found Page">
        <motion.div
          role="alert"
          aria-label="Page Not Found"
          className="box without-progress"
          {...scaleUpAnimation()}
        >
          <QuestionMark className="icon-lg icon-warning" aria-hidden="true" />
          <h1>Page Not Found</h1>
          <p className="-mt-2.5">
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
      </div>
    </PageLayout>
  );
};

export default NotFound;
