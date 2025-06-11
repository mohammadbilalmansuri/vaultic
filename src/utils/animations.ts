import { MotionProps, Easing } from "motion/react";

interface BaseAnimationConfig {
  delay?: number;
  duration?: number;
  ease?: Easing;
  withExit?: boolean;
  inView?: boolean;
}

export const fadeUpAnimation = ({
  y = 20,
  delay = 0,
  duration = 0.3,
  ease = "easeOut",
  withExit = false,
  inView = true,
}: BaseAnimationConfig & { y?: number } = {}): MotionProps =>
  Object.freeze({
    initial: { opacity: 0, y },
    animate: inView ? { opacity: 1, y: 0 } : undefined,
    exit: withExit ? { opacity: 0, y } : undefined,
    transition: inView || withExit ? { duration, delay, ease } : undefined,
  });

export const scaleUpAnimation = ({
  scale = 0.95,
  delay = 0,
  duration = 0.3,
  ease = "backOut",
  withExit = true,
  inView = true,
}: BaseAnimationConfig & { scale?: number } = {}): MotionProps =>
  Object.freeze({
    initial: { opacity: 0, scale },
    animate: inView ? { opacity: 1, scale: 1 } : undefined,
    exit: withExit ? { opacity: 0, scale } : undefined,
    transition: inView || withExit ? { duration, delay, ease } : undefined,
  });
