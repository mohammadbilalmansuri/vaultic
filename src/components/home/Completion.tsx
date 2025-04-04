"use client";
import { motion } from "motion/react";
import { Button } from "@/components/common";
import { Logo } from "@/components/icons";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/stores/notificationStore";

const Completion = () => {
  const router = useRouter();
  const notify = useNotificationStore((state) => state.notify);

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
        Keep your Secret Recovery Phrase in a safe place. If you lose it, no one
        can recover it for you, and you will permanently lose access to your
        wallet.
      </p>
      <Button
        className="mt-3"
        onClick={() => {
          notify("Wallet setup completed successfully!", "success");
          router.push("/dashboard");
        }}
      >
        Go to Dashboard
      </Button>
    </motion.div>
  );
};

export default Completion;
