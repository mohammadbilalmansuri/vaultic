"use client";
import { useState, useId, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import cn from "@/utils/cn";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "right" | "bottom" | "left";
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

  const getOffset = () => {
    switch (position) {
      case "top":
        return { initial: { y: 8 }, animate: { y: 0 }, exit: { y: 8 } };
      case "bottom":
        return { initial: { y: -8 }, animate: { y: 0 }, exit: { y: -8 } };
      case "left":
        return { initial: { x: 8 }, animate: { x: 0 }, exit: { x: 8 } };
      case "right":
        return { initial: { x: -8 }, animate: { x: 0 }, exit: { x: -8 } };
      default:
        return {};
    }
  };

  const { initial, animate, exit } = getOffset();

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center",
        containerClassName
      )}
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
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, scale: 0.8, ...initial }}
            animate={{ opacity: 1, scale: 1, ...animate }}
            exit={{ opacity: 0, scale: 0.8, ...exit }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute z-50 rounded-lg shadow-lg pointer-events-none bg-zinc-950 after:absolute after:-z-10 after:size-2.5 after:bg-zinc-950 after:rotate-45",
              {
                "bottom-full mb-2": position === "top",
                "after:top-full after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2":
                  position === "top",

                "left-full ml-2": position === "right",
                "after:right-full after:top-1/2 after:-translate-y-1/2 after:translate-x-1/2":
                  position === "right",

                "top-full mt-2": position === "bottom",
                "after:bottom-full after:left-1/2 after:-translate-x-1/2 after:translate-y-1/2":
                  position === "bottom",

                "right-full mr-2": position === "left",
                "after:left-full after:top-1/2 after:-translate-y-1/2 after:-translate-x-1/2":
                  position === "left",
              }
            )}
          >
            <div className="relative text-zinc-200 text-sm font-medium whitespace-nowrap px-2 py-1.5">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
