"use client";
import { useState } from "react";

const useCopy = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    if (copied) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCopied(false);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return { copied, copyToClipboard };
};

export default useCopy;
