"use client";
import { useSyncExternalStore } from "react";

/**
 * Hook to match a media query and respond to changes in screen size.
 * @param query Media query string (e.g., "(min-width: 768px)")
 * @returns Boolean indicating whether the query matches
 */
const useMatchMedia = (query: string): boolean => {
  const subscribe = (callback: () => void) => {
    if (typeof window === "undefined" || !window.matchMedia) return () => {};
    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener("change", callback);
    return () => {
      mediaQuery.removeEventListener("change", callback);
    };
  };

  const getSnapshot = () => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

export default useMatchMedia;
