"use client";
import { useState, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ReactNode } from "react";
import type { TooltipPosition } from "@/types";
import { tooltipSlideAnimation } from "@/utils/animations";
import cn from "@/utils/cn";

interface TooltipProps {
  content?: ReactNode;
  children: ReactNode;
  position?: TooltipPosition;
  delay?: number;
  containerClassName?: string;
  tooltipClassName?: string;
}

const POSITION_STYLES = {
  top: "bottom-full mb-2 after:top-full after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2",
  bottom:
    "top-full mt-2 after:bottom-full after:left-1/2 after:-translate-x-1/2 after:translate-y-1/2",
  left: "right-full mr-2 after:left-full after:top-1/2 after:-translate-y-1/2 after:-translate-x-1/2",
  right:
    "left-full ml-2 after:right-full after:top-1/2 after:-translate-y-1/2 after:translate-x-1/2",
} as const;

const Tooltip = ({
  content,
  children,
  position = "top",
  delay = 0.3,
  containerClassName = "",
  tooltipClassName = "",
}: TooltipProps) => {
  const tooltipId = useId();
  const [isVisible, setIsVisible] = useState(false);

  if (!content) return children;

  const { initial, animate, exit } = tooltipSlideAnimation(position, delay);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center",
        containerClassName
      )}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      onTouchStart={showTooltip}
      onTouchEnd={hideTooltip}
      onTouchCancel={hideTooltip}
      onClick={hideTooltip}
      aria-describedby={isVisible ? tooltipId : undefined}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            id={tooltipId}
            role="tooltip"
            initial={initial}
            animate={animate}
            exit={exit}
            className={cn(
              "absolute z-50 pointer-events-none rounded-lg bg-zinc-950 after:absolute after:-z-10 after:size-2.5 after:bg-zinc-950 after:rotate-45",
              POSITION_STYLES[position]
            )}
          >
            <div
              className={cn(
                "relative px-2 py-1.5 text-xs sm:text-sm font-medium text-zinc-200 leading-tight whitespace-nowrap text-center",
                tooltipClassName
              )}
            >
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
