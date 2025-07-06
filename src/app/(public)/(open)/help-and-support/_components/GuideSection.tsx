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
    <motion.div
      ref={ref}
      id={title.toLowerCase().replace(/\s+/g, "-")}
      className="w-full relative flex flex-col gap-3"
      {...fadeUpAnimation({ inView })}
    >
      <h2 className="h2">{title}</h2>
      {content}
    </motion.div>
  );
};

export default GuideSection;
