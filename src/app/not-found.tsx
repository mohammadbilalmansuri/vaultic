"use client";
import { motion } from "motion/react";

const NotFound = () => {
  return (
    <div className="w-full max-w-screen-lg flex flex-col items-center">
      <motion.img
        src="/404.svg"
        alt="404 Not Found"
        className="w-full max-w-xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        exit={{ scale: 0.8, opacity: 0 }}
      />
    </div>
  );
};

export default NotFound;
