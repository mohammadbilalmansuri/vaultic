"use client";
import { useRef } from "react";
import { useInView } from "motion/react";
import type { RefObject } from "react";
import type { UseInViewOptions } from "motion/react";

/**
 * A custom hook that uses Motion's `useInView` to detect if an element is visible in the viewport.
 * Defaults to -10% margin for early triggering, but can be fully customized via options.
 *
 * @template T - The type of DOM element to observe (defaults to HTMLElement).
 * @param options - Optional configuration to override default behavior
 * @returns An object containing:
 *   - `ref`: A React ref to be attached to the target element.
 *   - `inView`: A boolean indicating if the element is currently in view.
 */
const useMotionInView = <T extends Element = HTMLElement>(
  options?: Partial<UseInViewOptions>
): {
  ref: RefObject<T | null>;
  inView: boolean;
} => {
  const ref = useRef<T>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "0px 0px -10% 0px",
    ...options,
  });

  return { ref, inView };
};

export default useMotionInView;
