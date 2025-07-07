"use client";
import { ReactNode } from "react";
import { motion } from "motion/react";
import { fadeUpAnimation } from "@/utils/animations";
import { useMotionInView } from "@/hooks";

export interface IGuide {
  title: string;
  content: ReactNode;
}

const GuideSection = ({ title, content }: IGuide) => {
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
