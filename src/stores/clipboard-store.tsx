import { create } from "zustand";
import { notify } from "./notification-store";

interface ClipboardStore {
  copiedId: string | null;

  /**
   * Copies the given text to the clipboard and updates copied state.
   * If `id` is provided, it is used as the identifier for copied status;
   * otherwise, `text` is used as fallback ID.
   *
   * @param text Text to be copied to the clipboard.
   * @param id Optional ID to associate with the copy action.
   */
  copyToClipboard: (text: string, id?: string) => Promise<void>;
}

/**
 * Global clipboard store for managing copy operations across the application.
 *
 * Features:
 * - Global copied state with auto-reset after 2 seconds
 * - Custom ID support for copy tracking
 * - Handles browser API limitations and user notifications
 */
const useClipboardStore = create<ClipboardStore>((set, get) => {
  let timeoutRef: NodeJS.Timeout | null = null;

  return {
    copiedId: null,

    copyToClipboard: async (text: string, id?: string) => {
      const { copiedId } = get();
      const targetId = id || text;

      if (copiedId === targetId) return;

      if (timeoutRef) {
        clearTimeout(timeoutRef);
        timeoutRef = null;
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
        set({ copiedId: targetId });

        timeoutRef = setTimeout(() => {
          set({ copiedId: null });
          timeoutRef = null;
        }, 2000);
      } catch (error) {
        notify({
          type: "error",
          message: "Something went wrong while copying",
        });
        console.error("Failed to copy text:", error);
      }
    },
  };
});

/** Returns the currently copied item's ID (or `null` if none). */
export const useCopiedId = () => useClipboardStore((state) => state.copiedId);

/**
 * Provides the copy-to-clipboard function.
 * Use inside components to copy text and show feedback.
 */
export const useCopyToClipboard = () =>
  useClipboardStore((state) => state.copyToClipboard);
