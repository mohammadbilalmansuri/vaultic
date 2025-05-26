"use client";
import { motion } from "motion/react";
import { WiFiOff } from "../ui/icons";
import { scaleUpAnimation } from "@/utils/animations";

const OfflineView = () => {
  return (
    <motion.div {...scaleUpAnimation()} className="box p-12">
      <WiFiOff className="w-15 text-yellow-500" />
      <h2 className="mt-3">You are offline</h2>
      <p>
        It looks like you’ve lost your internet connection. Please check your
        network and try again.
      </p>
    </motion.div>
  );
};

export default OfflineView;
