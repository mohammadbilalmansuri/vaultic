"use client";
import { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { expandCollapseAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { AngleDown } from "../icons";

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
        "border-1.5 sm:rounded-3xl rounded-2xl transition-all duration-300",
        { "border-focus": isOpen }
      )}
    >
      <button
        type="button"
        onClick={toggleAccordion}
        id={questionId}
        aria-expanded={isOpen}
        aria-controls={answerId}
        className="sm:pl-5 pl-4 sm:pr-3 pr-2 py-3 w-full flex justify-between items-center gap-3 text-left group"
      >
        <span
          className={cn("h4 transition-all duration-300", {
            "text-color group-hover:heading-color": !isOpen,
          })}
        >
          {question}
        </span>

        <span className="icon-btn-bg group-hover:heading-color">
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
            <div className="sm:px-5 sm:pb-5 px-4 pb-4 text-left">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
