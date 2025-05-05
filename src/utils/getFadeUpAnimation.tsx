type FadeUpConfig = {
  y?: number;
  delay?: number;
  duration?: number;
  inView?: boolean;
};

const getFadeUpAnimation = ({
  y = 30,
  delay = 0,
  duration = 0.3,
  inView,
}: FadeUpConfig = {}) => ({
  initial: { opacity: 0, y },
  animate: inView !== false ? { opacity: 1, y: 0 } : undefined,
  transition: { duration, delay },
});

export default getFadeUpAnimation;
