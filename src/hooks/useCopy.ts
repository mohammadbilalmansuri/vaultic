"use client";
import { useState, useRef } from "react";
import useNotificationStore from "@/stores/notificationStore";

const useCopy = () => {
  const notify = useNotificationStore((state) => state.notify);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copyToClipboard = async (
    text: string,
    feedback = false
  ): Promise<boolean> => {
    if (!navigator?.clipboard?.writeText) {
      notify("Clipboard not supported in this browser.", "error");
      return false;
    }

    if (copied) return false;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      if (feedback) notify("Copied to clipboard!", "success");

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null;
      }, 2000);

      return true;
    } catch (error) {
      console.error("Failed to copy text:", error);
      notify("Oops! Something went wrong while copying.", "error");
      return false;
    }
  };

  return { copied, copyToClipboard };
};

export default useCopy;
