"use client";
import { useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useNotificationStore } from "@/stores";

/**
 * Hook for copying text to clipboard with error handling and state management.
 * Provides clipboard functionality with automatic state reset and user feedback.
 */
const useClipboard = () => {
  const { notify } = useNotificationStore.getState();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Copies text to clipboard and manages copied state with auto-reset.
   * @param text - Text content to copy to clipboard
   * @param copied - Current copied state (prevents duplicate operations)
   * @param setCopied - State setter for copied status
   */
  const copyToClipboard = async (
    text: string,
    copied: boolean,
    setCopied: Dispatch<SetStateAction<boolean>>
  ): Promise<void> => {
    if (copied) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!navigator?.clipboard?.writeText) {
      notify({
        type: "error",
        message: "Clipboard not supported in this browser",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null;
      }, 2000);
    } catch (error) {
      notify({ type: "error", message: "Something went wrong while copying" });
      console.error("Failed to copy text:", error);
    }
  };

  return copyToClipboard;
};

export default useClipboard;
