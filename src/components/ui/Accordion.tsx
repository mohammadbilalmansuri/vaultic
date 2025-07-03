"use client";
import { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { expandCollapseAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { AngleDown } from "./icons";

interface AccordionProps {
  isOpen: boolean;
  toggleAccordion: () => void;
  question: string;
  answer: ReactNode;
  index: number;
}

const Accordion = ({
  isOpen,
  toggleAccordion,
  question,
  answer,
  index,
}: AccordionProps) => {
  const answerId = `accordion-answer-${index}`;
  const questionId = `accordion-question-${index}`;

  return (
    <div
      className={cn(
        "border-1.5 border-color rounded-3xl transition-all duration-300 text-left",
        isOpen ? "border-focus" : "border-color"
      )}
    >
      <button
        type="button"
        onClick={toggleAccordion}
        className="pl-5 py-3 pr-3 w-full flex justify-between items-center"
        aria-expanded={isOpen}
        aria-controls={answerId}
        id={questionId}
      >
        <span
          className={cn("text-lg font-semibold transition-all duration-300", {
            "heading-color": isOpen,
          })}
        >
          {question}
        </span>

        <span className="icon-btn-bg">
          <AngleDown
            className={cn("transition-all duration-300", {
              "rotate-180": isOpen,
            })}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key={answerId}
            id={answerId}
            role="region"
            aria-labelledby={questionId}
            className="overflow-hidden"
            {...expandCollapseAnimation()}
          >
            <div className="px-5 pb-5">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
