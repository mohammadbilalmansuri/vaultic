"use client";
import { useState, useId, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TTooltipPosition } from "@/types";
import cn from "@/utils/cn";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: TTooltipPosition;
  containerClassName?: string;
  tooltipClassName?: string;
}

const getAnimationVariants = (position: TTooltipPosition) => {
  const offsetDistance = 8;
  const hidden = { scale: 0.9, opacity: 0 };
  const visible = { scale: 1, opacity: 1 };

  switch (position) {
    case "top":
      return {
        initial: { ...hidden, y: offsetDistance },
        animate: { ...visible, y: 0 },
        exit: { ...hidden, y: offsetDistance },
      };
    case "bottom":
      return {
        initial: { ...hidden, y: -offsetDistance },
        animate: { ...visible, y: 0 },
        exit: { ...hidden, y: -offsetDistance },
      };
    case "left":
      return {
        initial: { ...hidden, x: offsetDistance },
        animate: { ...visible, x: 0 },
        exit: { ...hidden, x: offsetDistance },
      };
    case "right":
      return {
        initial: { ...hidden, x: -offsetDistance },
        animate: { ...visible, x: 0 },
        exit: { ...hidden, x: -offsetDistance },
      };
    default:
      return {};
  }
};

const Tooltip = ({
  content,
  children,
  position = "top",
  containerClassName = "",
  tooltipClassName = "",
}: TooltipProps) => {
  const tooltipId = useId();
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  const { initial, animate, exit } = getAnimationVariants(position);

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
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute z-50 rounded-lg pointer-events-none bg-zinc-950 after:absolute after:-z-10 after:size-2.5 after:bg-zinc-950 after:rotate-45",
              {
                "bottom-full mb-2 after:top-full after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2":
                  position === "top",
                "top-full mt-2 after:bottom-full after:left-1/2 after:-translate-x-1/2 after:translate-y-1/2":
                  position === "bottom",
                "right-full mr-2 after:left-full after:top-1/2 after:-translate-y-1/2 after:-translate-x-1/2":
                  position === "left",
                "left-full ml-2 after:right-full after:top-1/2 after:-translate-y-1/2 after:translate-x-1/2":
                  position === "right",
              }
            )}
          >
            <div
              className={cn(
                "relative text-zinc-200 sm:text-sm text-xs font-medium px-2 py-1.5 leading-tight whitespace-nowrap text-center",
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
