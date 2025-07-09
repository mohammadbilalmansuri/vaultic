"use client";
import { motion } from "motion/react";
import { scaleUpAnimation } from "@/utils/animations";
import { WiFiOff } from "../icons";

const OfflineView = () => {
  return (
    <motion.div
      role="alert"
      aria-label="Connection Lost Alert"
      className="box without-progress"
      {...scaleUpAnimation()}
    >
      <WiFiOff className="icon-lg icon-warning" aria-hidden="true" />
      <h1>Connection Lost</h1>
      <p className="max-w-xs -mt-2.5">
        Please check your internet connection and try again.
      </p>
    </motion.div>
  );
};

export default OfflineView;
