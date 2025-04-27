"use client";
import { motion } from "motion/react";
import { Button } from "@/components/ui";
import useUserStore from "@/stores/userStore";

const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay },
});

const NotFound = () => {
  const userExists = useUserStore((state) => state.userExists);

  return (
    <div className="w-full max-w-screen-lg flex flex-col items-center">
      <div className="flex flex-col items-center gap-8 text-center">
        <motion.h1
          className="text-6xl font-bold heading-color leading-tight"
          {...fadeInUp(0)}
        >
          Page not found
        </motion.h1>

        <motion.p className="text-xl -mt-2" {...fadeInUp(0.15)}>
          The page you're searching for isn't available.
        </motion.p>

        <motion.div {...fadeInUp(0.3)} className="mt-1">
          <Button
            variant="zinc"
            as="link"
            href={userExists ? "/dashboard" : "/"}
          >
            Go to {userExists ? "Dashboard" : "Home"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
