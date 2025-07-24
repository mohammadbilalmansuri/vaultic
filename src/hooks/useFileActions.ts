"use client";
import { useNotificationStore } from "@/stores";

type FileSource = string | Blob | File;

interface DownloadFileArgs {
  file: FileSource;
  fileName: string;
  successMessage?: string;
  onComplete?: () => void;
}

interface ShareFileArgs {
  file: FileSource;
  fileName: string;
  title: string;
  text: string;
}

/**
 * Hook for file download and sharing operations with error handling.
 * Supports URLs, Blobs, and File objects with native browser sharing.
 */
const useFileActions = () => {
  const { notify } = useNotificationStore.getState();

  // Converts various file types to Blob for consistent handling
  const resolveBlob = async (file: FileSource): Promise<Blob> => {
    if (typeof file === "string") {
      try {
        const res = await fetch(file);
        if (!res.ok) throw new Error("Failed to fetch file from URL.");
        return await res.blob();
      } catch {
        throw new Error("Could not fetch the file. Check the URL or network.");
      }
    }
    return file;
  };

  /**
   * Downloads a file to the user's device using browser download API.
   * @param file - File source (URL, Blob, or File object)
   * @param fileName - Name for the downloaded file
   * @param successMessage - Custom success notification message
   * @param onComplete - Callback executed after successful download
   */
  const downloadFile = async ({
    file,
    fileName,
    successMessage = "Download started.",
    onComplete,
  }: DownloadFileArgs) => {
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

      notify({ type: "success", message: successMessage, duration: 3000 });
      onComplete?.();
    } catch (error) {
      notify({
        type: "error",
        message: "Failed to download the file. Please try again.",
      });
      console.error(error);
    }
  };

  /**
   * Shares a file using the native Web Share API (mobile/supported browsers).
   * @param file - File source (URL, Blob, or File object)
   * @param fileName - Name for the shared file
   * @param title - Share dialog title
   * @param text - Share dialog description text
   */
  const shareFile = async ({ file, fileName, title, text }: ShareFileArgs) => {
    try {
      if (!navigator.share) {
        notify({
          type: "error",
          message: "Sharing is not supported on this device.",
        });
        return;
      }

      const blob = await resolveBlob(file);
      const fileToShare = new File([blob], fileName, { type: blob.type });

      const canShareFiles =
        navigator.canShare?.({ files: [fileToShare] }) ?? false;

      if (!canShareFiles) {
        notify({ type: "error", message: "This device cannot share files." });
        return;
      }

      await navigator.share({
        files: [fileToShare],
        title,
        text,
      });
    } catch (error) {
      notify({
        type: "error",
        message: "File sharing failed or was cancelled.",
      });
      console.error(error);
    }
  };

  return { downloadFile, shareFile };
};

export default useFileActions;
