"use client";
import { Dispatch, SetStateAction } from "react";
import useNotificationStore from "@/stores/notificationStore";
import delay from "@/utils/delay";

const useCopy = () => {
  const notify = useNotificationStore((state) => state.notify);

  const copyToClipboard = async (
    text: string,
    copied: boolean,
    setCopied: Dispatch<SetStateAction<boolean>>,
    feedback = true
  ): Promise<boolean> => {
    if (!navigator?.clipboard?.writeText) {
      notify({
        type: "error",
        message: "Clipboard not supported in this browser.",
      });
      return false;
    }

    if (copied) return false;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      if (feedback) {
        notify({
          type: "success",
          message: "Copied to clipboard!",
        });
      }

      await delay(2000);
      setCopied(false);
      return true;
    } catch (error) {
      console.error("Failed to copy text:", error);
      notify({
        type: "error",
        message: "Something went wrong while copying",
      });
      return false;
    }
  };

  return copyToClipboard;
};

export default useCopy;
