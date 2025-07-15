"use client";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { fadeUpAnimation } from "@/utils/animations";
import { useMotionInView } from "@/hooks";

export interface Guide {
  title: string;
  content: ReactNode;
}

const GuideSection = ({ title, content }: Guide) => {
  const { ref, inView } = useMotionInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      aria-label={title}
      className="w-full relative flex flex-col sm:gap-4 gap-3 px-1"
    >
      <motion.h2 className="h2" {...fadeUpAnimation({ inView, delay: 0.05 })}>
        {title}
      </motion.h2>
      <motion.div
        className="w-full flex flex-col sm:gap-3 gap-2.5"
        {...fadeUpAnimation({ inView, delay: 0.1 })}
      >
        {content}
      </motion.div>
    </div>
  );
};

export default GuideSection;
