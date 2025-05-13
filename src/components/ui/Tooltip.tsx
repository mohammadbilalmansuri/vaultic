"use client";
import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import cn from "@/utils/cn";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  containerClassName?: string;
  position?: "top" | "bottom";
  open?: boolean;
}

const Tooltip = ({
  content,
  children,
  containerClassName = "",
  position = "bottom",
  open,
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const isVisible = open !== undefined ? open : visible;

  const show = () => {
    if (open === undefined) setVisible(true);
  };
  const hide = () => {
    if (open === undefined) setVisible(false);
  };

  return (
    <div
      className={cn("relative flex flex-col items-center", containerClassName)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onTouchStart={show}
      onTouchEnd={hide}
      onTouchCancel={hide}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            role="tooltip"
            initial={{
              opacity: 0,
              scale: 0.8,
              y: position === "top" ? 10 : -10,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: position === "top" ? 10 : -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute z-50 whitespace-nowrap rounded-lg p-2 text-sm pointer-events-none bg-zinc-300 dark:bg-zinc-950 text-zinc-900 leading-none font-medium dark:font-normal shadow-lg",
              {
                "bottom-full mb-1": position === "top",
                "top-full mt-1": position === "bottom",
              }
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
