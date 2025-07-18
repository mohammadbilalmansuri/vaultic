import { create } from "zustand";
import type { Notification } from "@/types";

interface NotificationStore extends Notification {
  opened: boolean;
  notify: ({ type, message, duration }: Notification) => void;
  closeNotification: () => void;
}

/**
 * Notification store for managing toast notifications with auto-dismiss.
 * Handles notification queuing and smooth transitions between messages.
 */
const useNotificationStore = create<NotificationStore>((set, get) => {
  let timeoutId: NodeJS.Timeout | null = null;

  const startTimer = (duration: number) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => get().closeNotification(), duration);
  };

  return {
    opened: false,
    type: "info",
    message: "",

    notify: ({ type = "info", message, duration = 4000 }) => {
      const { opened } = get();

      if (opened) {
        set({ opened: false });
        setTimeout(() => {
          set({ opened: true, type, message });
          startTimer(duration);
        }, 250);
      } else {
        set({ opened: true, type, message });
        startTimer(duration);
      }
    },

    closeNotification: () => {
      if (timeoutId) clearTimeout(timeoutId);
      set({ opened: false, type: "info", message: "" });
    },
  };
});

export default useNotificationStore;
