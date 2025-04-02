"use client";
import { ButtonHTMLAttributes } from "react";
import { motion } from "motion/react";

interface ExpandProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  expanded: boolean;
}

const Expand = ({ expanded, ...props }: ExpandProps) => {
  return (
    <button type="button" className="icon" {...props}>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        animate={{ rotate: expanded ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
      </motion.svg>
    </button>
  );
};

export default Expand;
