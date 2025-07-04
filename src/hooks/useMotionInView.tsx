"use client";
import { useRef } from "react";
import { useInView, UseInViewOptions } from "motion/react";

/**
 * A custom hook that uses Motion's `useInView` to detect if an element is visible in the viewport.
 * @param options - Configuration options for in-view detection (default: { once: true })
 * @returns An object containing:
 *   - `ref`: A React ref to be attached to the target element.
 *   - `inView`: A boolean indicating if the element is currently in view.
 */
const useMotionInView = (options: UseInViewOptions = { once: true }) => {
  const ref = useRef<Element>(null);
  const inView = useInView(ref, options);

  return { ref, inView };
};

export default useMotionInView;
