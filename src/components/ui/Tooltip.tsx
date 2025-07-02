"use client";
import { useState, ReactNode, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import cn from "@/utils/cn";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom";
  containerClassName?: string;
}

const Tooltip = ({
  content,
  children,
  position = "top",
  containerClassName = "",
}: TooltipProps) => {
  const tooltipId = useId();
  const [visible, setVisible] = useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

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
        {visible && (
          <motion.div
            role="tooltip"
            id={tooltipId}
            aria-live="polite"
            initial={{
              opacity: 0,
              scale: 0.8,
              y: position === "top" ? 10 : -10,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: position === "top" ? 10 : -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute z-50 whitespace-nowrap rounded-lg p-2 text-sm bg-zinc-950 text-zinc-200 leading-none font-medium dark:font-normal shadow-lg pointer-events-none",
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
