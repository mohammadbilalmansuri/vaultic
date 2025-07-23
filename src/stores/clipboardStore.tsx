import { create } from "zustand";
import { useNotificationStore } from "@/stores";

interface ClipboardStore {
  copiedId: string | null;
  copyToClipboard: (text: string, id: string) => Promise<void>;
}

/**
 * Global clipboard store for managing copy operations across the application.
 *
 * Features:
 * - Only one item can be "copied" at a time globally
 * - Auto-resets copied state after 2 seconds
 * - Prevents race conditions between multiple copy buttons
 * - Provides error notifications on failure
 */
const useClipboardStore = create<ClipboardStore>((set, get) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return {
    copiedId: null,

    copyToClipboard: async (text: string, id: string) => {
      const { copiedId } = get();

      if (copiedId === id) return;

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      if (!navigator?.clipboard?.writeText) {
        useNotificationStore.getState().notify({
          type: "error",
          message: "Clipboard not supported in this browser",
        });
        return;
      }

      try {
        await navigator.clipboard.writeText(text);
        set({ copiedId: id });

        timeoutId = setTimeout(() => {
          set({ copiedId: null });
          timeoutId = null;
        }, 2000);
      } catch (error) {
        useNotificationStore.getState().notify({
          type: "error",
          message: "Something went wrong while copying",
        });
        console.error("Failed to copy text:", error);
      }
    },
  };
});

export default useClipboardStore;
