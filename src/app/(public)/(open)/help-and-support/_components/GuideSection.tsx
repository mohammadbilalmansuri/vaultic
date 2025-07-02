"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { IGuide } from "@/types";
import { fadeUpAnimation } from "@/utils/animations";

const GuideSection = ({ title, content }: IGuide) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <motion.div
      ref={ref}
      id={title.toLowerCase().replace(/\s+/g, "-")}
      className="w-full relative flex flex-col gap-3"
      {...fadeUpAnimation({ inView })}
    >
      <h3 className="text-2xl font-semibold heading-color leading-tight">
        {title}
      </h3>
      <div className="flex flex-col gap-2">{content}</div>
    </motion.div>
  );
};

export default GuideSection;
