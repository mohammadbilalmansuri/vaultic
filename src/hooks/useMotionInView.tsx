"use client";
import { useRef, RefObject } from "react";
import { useInView, UseInViewOptions } from "motion/react";
import useMatchMedia from "./useMatchMedia";

/**
 * A custom hook that uses Motion's `useInView` to detect if an element is visible in the viewport.
 * Automatically adjusts trigger margins based on screen height for better responsive behavior.
 * @template T - The type of DOM element to observe (defaults to HTMLElement).
 * @returns An object containing:
 *   - `ref`: A React ref to be attached to the target element.
 *   - `inView`: A boolean indicating if the element is currently in view.
 */
const useMotionInView = <T extends Element = HTMLElement>(): {
  ref: RefObject<T | null>;
  inView: boolean;
} => {
  const isLowHeight = useMatchMedia("(max-height: 800px)");

  const options: UseInViewOptions = {
    once: true,
    margin: isLowHeight ? "0px 0px -10% 0px" : "0px 0px -20% 0px",
  };

  const ref = useRef<T>(null);
  const inView = useInView(ref, options);

  return { ref, inView };
};

export default useMotionInView;
