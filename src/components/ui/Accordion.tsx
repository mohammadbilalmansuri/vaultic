"use client";
import { MouseEventHandler } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AngleDown } from "@/components/ui/icons";
import { Tooltip } from "@/components/ui";
import cn from "@/utils/cn";

interface AccordionProps {
  isOpen: boolean;
  toggleAccordion: MouseEventHandler<HTMLDivElement>;
  question: string;
  answer: string;
}

const Accordion = ({
  isOpen,
  toggleAccordion,
  question,
  answer,
}: AccordionProps) => {
  return (
    <div
      className={cn(
        "border-1.5 border-color rounded-3xl transition-all duration-300",
        {
          "border-zinc-300 dark:border-zinc-700": isOpen,
          "hover:border-zinc-300 dark:hover:border-zinc-700": !isOpen,
        }
      )}
    >
      <div
        onClick={toggleAccordion}
        className="pl-5 py-3.5 pr-3.5 w-full flex justify-between items-center cursor-pointer"
      >
        <h5
          className={cn("text-lg transition-all duration-300", {
            "heading-color": isOpen,
          })}
        >
          {question}
        </h5>
        <Tooltip
          containerClassName="on-hover-bg-icon"
          content={isOpen ? "Collapse" : "Expand"}
        >
          <AngleDown
            className={cn("transition-all duration-300", {
              "rotate-180": isOpen,
            })}
          />
        </Tooltip>
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="px-5 pb-5">{answer}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
