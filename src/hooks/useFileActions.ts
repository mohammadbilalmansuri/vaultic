"use client";
import { useNotificationStore } from "@/stores";

type TFile = string | Blob | File;

const useFileActions = () => {
  const notify = useNotificationStore((state) => state.notify);

  const resolveBlob = async (file: TFile): Promise<Blob> => {
    if (typeof file === "string") {
      const res = await fetch(file);
      if (!res.ok) throw new Error("Failed to fetch file");
      return await res.blob();
    }
    return file;
  };

  const downloadFile = async (
    file: TFile,
    fileName: string,
    successMessage = "Download started successfully",
    onComplete?: () => void
  ) => {
    try {
      const blob = await resolveBlob(file);
      const url = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      URL.revokeObjectURL(url);
      notify({ type: "success", message: successMessage });
      onComplete?.();
    } catch (error) {
      notify({
        type: "error",
        message: "Couldn't download the file. Please try again.",
      });
      console.error(error);
    }
  };

  const shareFile = async (
    file: TFile,
    fileName: string,
    shareTitle: string,
    shareText: string
  ) => {
    try {
      if (!navigator.share) {
        notify({
          type: "error",
          message: "This device doesn't support sharing.",
        });
        return;
      }

      const blob = await resolveBlob(file);
      const fileToShare = new File([blob], fileName, { type: blob.type });

      const canShareFiles =
        navigator.canShare?.({ files: [fileToShare] }) ?? false;

      if (!canShareFiles) {
        notify({
          type: "error",
          message: "Sharing files isn't supported on this device.",
        });
        return;
      }

      await navigator.share({
        files: [fileToShare],
        title: shareTitle,
        text: shareText,
      });

      notify({ type: "success", message: "File shared successfully." });
    } catch (error) {
      notify({
        type: "error",
        message: "Couldn't share the file. Please try again.",
      });
      console.error(error);
    }
  };

  return { downloadFile, shareFile };
};

export default useFileActions;
