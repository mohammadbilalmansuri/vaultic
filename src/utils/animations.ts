import { MotionProps, Easing } from "motion/react";

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
 * @returns MotionProps object for Framer Motion components
 */
export const fadeUpAnimation = ({
  y = 20,
  delay = 0,
  duration = 0.3,
  ease = "easeOut",
  withExit = false,
  inView = true,
}: BaseAnimationConfig & { y?: number } = {}): MotionProps => {
  return Object.freeze({
    initial: { opacity: 0, y },
    animate: inView ? { opacity: 1, y: 0 } : undefined,
    exit: withExit ? { opacity: 0, y } : undefined,
    transition: inView || withExit ? { duration, delay, ease } : undefined,
  });
};

/**
 * Creates a scale-up animation with opacity fade.
 * @param scale - Initial scale value (default: 0.95)
 * @param delay - Animation delay in seconds (default: 0)
 * @param duration - Animation duration in seconds (default: 0.3)
 * @param ease - Easing function (default: "backOut")
 * @param withExit - Include exit animation (default: true)
 * @param inView - Trigger animation when in view (default: true)
 * @returns MotionProps object for Framer Motion components
 */
export const scaleUpAnimation = ({
  scale = 0.95,
  delay = 0,
  duration = 0.3,
  ease = "backOut",
  withExit = true,
  inView = true,
}: BaseAnimationConfig & { scale?: number } = {}): MotionProps => {
  return Object.freeze({
    initial: { opacity: 0, scale },
    animate: inView ? { opacity: 1, scale: 1 } : undefined,
    exit: withExit ? { opacity: 0, scale } : undefined,
    transition: inView || withExit ? { duration, delay, ease } : undefined,
  });
};
