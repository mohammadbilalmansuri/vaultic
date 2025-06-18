"use client";
import { useNotificationStore } from "@/stores";

type TFile = string | Blob | File;

interface IDownloadFileArgs {
  file: TFile;
  fileName: string;
  successMessage?: string;
  onComplete?: () => void;
}

interface IShareFileArgs {
  file: TFile;
  fileName: string;
  title: string;
  text: string;
}

const useFileActions = () => {
  const notify = useNotificationStore((state) => state.notify);

  const resolveBlob = async (file: TFile): Promise<Blob> => {
    if (typeof file === "string") {
      try {
        const res = await fetch(file);
        if (!res.ok) throw new Error("Failed to fetch file from URL.");
        return await res.blob();
      } catch (err) {
        throw new Error("Could not fetch the file. Check the URL or network.");
      }
    }
    return file;
  };

  const downloadFile = async ({
    file,
    fileName,
    successMessage = "Download started.",
    onComplete,
  }: IDownloadFileArgs) => {
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

  const shareFile = async ({ file, fileName, title, text }: IShareFileArgs) => {
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
