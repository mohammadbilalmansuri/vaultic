"use client";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";

/**
 * Hook for detecting clicks outside a referenced element.
 * Useful for closing dropdowns, modals, or other overlay components.
 * @template T - The type of DOM element to observe (defaults to HTMLElement).
 * @param handler - Callback function to execute when outside click is detected
 * @param enabled - Whether the outside click detection is active (default: true)
 * @returns Ref to attach to the element you want to monitor
 */
const useOutsideClick = <T extends Element = HTMLElement>(
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled = true
): RefObject<T | null> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [handler, enabled]);

  return ref;
};

export default useOutsideClick;
