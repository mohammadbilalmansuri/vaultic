interface FadeUpConfig {
  y?: number;
  delay?: number;
  duration?: number;
  inView?: boolean;
}

interface ScaleUpConfig {
  scale?: number;
  delay?: number;
  duration?: number;
  inView?: boolean;
}

export const fadeUpAnimation = ({
  y = 30,
  delay = 0,
  duration = 0.3,
  inView,
}: FadeUpConfig = {}) => ({
  initial: { opacity: 0, y },
  animate: inView !== false ? { opacity: 1, y: 0 } : undefined,
  transition: { duration, delay },
});

export const scaleUpAnimation = ({
  scale = 0.8,
  delay = 0,
  duration = 0.4,
  inView,
}: ScaleUpConfig = {}) => ({
  initial: { opacity: 0, scale },
  animate: inView !== false ? { opacity: 1, scale: 1 } : undefined,
  transition: { duration, delay, ease: "easeInOut" },
});
