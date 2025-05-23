"use client";
import { Dispatch, SetStateAction } from "react";
import { useNotificationStore } from "@/stores";

const useClipboard = () => {
  const notify = useNotificationStore((state) => state.notify);

  const copyToClipboard = async (
    text: string,
    copied: boolean,
    setCopied: Dispatch<SetStateAction<boolean>>
  ): Promise<boolean> => {
    if (copied) return false;

    if (!navigator?.clipboard?.writeText) {
      notify({
        type: "error",
        message: "Clipboard not supported in this browser",
        duration: 2500,
      });
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      return true;
    } catch (error) {
      console.error("Failed to copy text:", error);
      notify({
        type: "error",
        message: "Something went wrong while copying",
        duration: 2500,
      });
      return false;
    }
  };

  return copyToClipboard;
};

export default useClipboard;
