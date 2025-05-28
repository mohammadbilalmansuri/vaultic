"use client";
import { motion } from "motion/react";
import { WiFiOff } from "../ui/icons";
import { scaleUpAnimation } from "@/utils/animations";

const OfflineView = () => {
  return (
    <motion.div {...scaleUpAnimation()} className="box p-12">
      <WiFiOff className="w-15 text-yellow-500 mx-auto" />
      <h2 className="mt-3">Connection Lost</h2>
      <p className="max-w-xs">
        Please check your internet connection and try again.
      </p>
    </motion.div>
  );
};

export default OfflineView;
