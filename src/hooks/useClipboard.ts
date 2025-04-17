"use client";
import { Dispatch, SetStateAction, ClipboardEvent } from "react";
import useNotificationStore from "@/stores/notificationStore";
import delay from "@/utils/delay";
import {
  UseFormSetError,
  UseFormClearErrors,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";
import { TImportWalletFormData, TMnemonicLength } from "@/types";

const useClipboard = () => {
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

  const handlePasteMnemonic = (
    event: ClipboardEvent<HTMLInputElement>,
    mnemonicLength: TMnemonicLength,
    setMnemonicLength: Dispatch<SetStateAction<TMnemonicLength>>,
    setError: UseFormSetError<TImportWalletFormData>,
    clearErrors: UseFormClearErrors<TImportWalletFormData>,
    reset: UseFormReset<TImportWalletFormData>,
    setValue: UseFormSetValue<TImportWalletFormData>
  ) => {
    event.preventDefault();

    try {
      const text = event.clipboardData.getData("text").trim();
      const words = text.split(/\s+/).filter(Boolean);
      const wordCount = words.length;

      if (wordCount === 12 || wordCount === 24) {
        if (wordCount !== mnemonicLength) {
          setMnemonicLength(wordCount as TMnemonicLength);
          reset({ mnemonic: Array(wordCount).fill("") });
        }

        words.forEach((word, index) =>
          setValue(`mnemonic.${index}`, word, { shouldValidate: true })
        );

        clearErrors("mnemonic");
      } else {
        setError("mnemonic", {
          type: "manual",
          message: "The recovery phrase must contain exactly 12 or 24 words",
        });
        delay(4000);
        clearErrors("mnemonic");
      }
    } catch (error) {
      console.error("Failed to paste recovery phrase:", error);
      setError("mnemonic", {
        type: "manual",
        message: "Something went wrong while pasting the recovery phrase",
      });
      delay(4000);
      clearErrors("mnemonic");
    }
  };

  return {
    copyToClipboard,
    handlePasteMnemonic,
  };
};

export default useClipboard;
