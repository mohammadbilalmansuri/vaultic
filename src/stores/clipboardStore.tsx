import { create } from "zustand";
import { useNotificationStore } from "@/stores";

interface ClipboardStore {
  copiedId: string | null;
  copyToClipboard: (text: string, id?: string) => Promise<void>;
}

/**
 * Global clipboard store for managing copy operations across the application.
 *
 * Features:
 * - Global state management - only one item copied at a time
 * - Auto-resets copied state after 2 seconds
 * - Prevents race conditions between multiple copy buttons
 * - Flexible ID system - use custom ID or fallback to text
 * - Error handling with user notifications
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
        useNotificationStore.getState().notify({
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
