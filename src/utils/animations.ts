import { MotionProps, Easing } from "motion/react";

interface BaseAnimationConfig {
  delay?: number;
  duration?: number;
  ease?: Easing;
  inView?: boolean;
}

export const fadeUpAnimation = ({
  y = 30,
  delay = 0,
  duration = 0.3,
  ease = "easeOut",
  inView = true,
}: BaseAnimationConfig & { y?: number } = {}): MotionProps => ({
  initial: { opacity: 0, y },
  animate: inView ? { opacity: 1, y: 0 } : undefined,
  transition: { duration, delay, ease },
});

export const scaleUpAnimation = ({
  scale = 0.8,
  delay = 0,
  duration = 0.2,
  ease = "easeOut",
  inView = true,
}: BaseAnimationConfig & { scale?: number } = {}): MotionProps => ({
  initial: { opacity: 0, scale },
  animate: inView ? { opacity: 1, scale: 1 } : undefined,
  exit: { opacity: 0, scale },
  transition: { duration, delay, ease },
});
