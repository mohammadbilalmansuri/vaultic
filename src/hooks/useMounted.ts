"use client";
import { useState, useEffect } from "react";

/**
 * Hook for tracking component mount state with optional delay.
 * Useful for preventing SSR hydration mismatches and delayed animations.
 * @param delay - Optional delay in milliseconds before setting mounted to true (default: 0)
 * @returns Boolean indicating if the component is mounted (and delay has passed)
 */
const useMounted = (delay = 0): boolean => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return mounted;
};

export default useMounted;
