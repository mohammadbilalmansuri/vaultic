"use client";
import { useEffect, useRef } from "react";

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
  }, [enabled]);

  return ref;
};

export default useOutsideClick;
