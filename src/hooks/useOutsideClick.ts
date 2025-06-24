"use client";
import { useEffect, useRef } from "react";

/**
 * Hook for detecting clicks outside a referenced element.
 * Useful for closing dropdowns, modals, or other overlay components.
 * @param handler - Callback function to execute when outside click is detected
 * @param enabled - Whether the outside click detection is active (default: true)
 * @returns Ref to attach to the element you want to monitor
 */
const useOutsideClick = (
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled = true
) => {
  const ref = useRef<HTMLDivElement>(null);

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
