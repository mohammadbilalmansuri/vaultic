import type { MotionProps, Easing } from "motion/react";
import type { TooltipPosition } from "@/types";

interface BaseAnimationConfig {
  delay?: number;
  duration?: number;
  ease?: Easing;
  withExit?: boolean;
  inView?: boolean;
}

/**
 * Creates a fade-up animation with customizable vertical movement.
 * @param y - Vertical offset in pixels (default: 20)
 * @param delay - Animation delay in seconds (default: 0)
 * @param duration - Animation duration in seconds (default: 0.3)
 * @param ease - Easing function (default: "easeOut")
 * @param withExit - Include exit animation (default: false)
 * @param inView - Trigger animation when in view (default: true)
 * @returns MotionProps object for Motion components
 */
export const fadeUpAnimation = ({
  y = 20,
  delay = 0,
  duration = 0.3,
  ease = "easeOut",
  withExit = false,
  inView = true,
}: BaseAnimationConfig & { y?: number } = {}): MotionProps => {
  return {
    initial: { opacity: 0, y },
    animate: inView ? { opacity: 1, y: 0 } : undefined,
    exit: withExit ? { opacity: 0, y: -y } : undefined,
    transition: inView || withExit ? { duration, delay, ease } : undefined,
  };
};

/**
 * Creates a scale-up animation with opacity fade.
 * @param scale - Initial scale value (default: 0.95)
 * @param delay - Animation delay in seconds (default: 0)
 * @param duration - Animation duration in seconds (default: 0.3)
 * @param ease - Easing function (default: "backOut")
 * @param withExit - Include exit animation (default: true)
 * @param inView - Trigger animation when in view (default: true)
 * @returns MotionProps object for Motion components
 */
export const scaleUpAnimation = ({
  scale = 0.95,
  delay = 0,
  duration = 0.3,
  ease = "backOut",
  withExit = true,
  inView = true,
}: BaseAnimationConfig & { scale?: number } = {}): MotionProps => {
  return {
    initial: { opacity: 0, scale },
    animate: inView ? { opacity: 1, scale: 1 } : undefined,
    exit: withExit ? { opacity: 0, scale } : undefined,
    transition: inView || withExit ? { duration, delay, ease } : undefined,
  };
};

/**
 * Creates an expand-collapse animation using height and opacity.
 * @param duration - Animation duration in seconds (default: 0.3)
 * @param ease - Easing function (default: "easeInOut")
 * @returns MotionProps for Motion components
 */
export const expandCollapseAnimation = ({
  duration = 0.3,
  ease = "easeInOut",
}: {
  duration?: BaseAnimationConfig["duration"];
  ease?: BaseAnimationConfig["ease"];
} = {}): MotionProps => {
  return {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: { duration, ease },
  };
};

/**
 * Creates a fade-in animation using opacity only.
 * @param duration - Animation duration in seconds (default: 0.15)
 * @param ease - Easing function (default: "easeOut")
 * @returns MotionProps object for Motion components
 */
export const fadeInAnimation = ({
  duration = 0.15,
  ease = "easeOut",
}: {
  duration?: BaseAnimationConfig["duration"];
  ease?: BaseAnimationConfig["ease"];
} = {}): MotionProps => {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration, ease },
  };
};

/**
 * Creates directional tooltip animation with scale, opacity, and slide-in.
 * @param position - Direction of tooltip (top, bottom, left, right)
 * @param delay - Delay before animation starts (default: 0)
 * @returns MotionProps object for Motion components
 */
export const tooltipSlideAnimation = (
  position: TooltipPosition,
  delay = 0
): MotionProps => {
  const offset = 8;

  const initialOffsets: Record<TooltipPosition, { x?: number; y?: number }> = {
    top: { y: offset },
    bottom: { y: -offset },
    left: { x: offset },
    right: { x: -offset },
  };

  const initialOffset = initialOffsets[position];
  const axis = "x" in initialOffset ? "x" : "y";

  const hidden = { scale: 0.9, opacity: 0 };
  const visible = { scale: 1, opacity: 1 };
  const transition = { duration: 0.15, ease: "easeOut" };

  return {
    initial: { ...hidden, ...initialOffset, transition },
    animate: { ...visible, [axis]: 0, transition: { ...transition, delay } },
    exit: { ...hidden, ...initialOffset, transition },
  };
};
