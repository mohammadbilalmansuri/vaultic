import { create } from "zustand";
import type { Notification } from "@/types";

interface NotificationState {
  opened: boolean;
  type: "info" | "success" | "error";
  message: string;
}

interface NotificationActions {
  notify: ({ type, message, duration }: Notification) => void;
  closeNotification: () => void;
}

interface NotificationStore extends NotificationState {
  actions: NotificationActions;
}

/**
 * Notification store for managing toast notifications with auto-dismiss.
 * Handles notification queuing and smooth transitions between messages.
 */
const useNotificationStore = create<NotificationStore>((set, get) => {
  let timeoutId: NodeJS.Timeout | null = null;

  const startTimer = (duration: number) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => get().actions.closeNotification(), duration);
  };

  return {
    opened: false,
    type: "info",
    message: "",

    actions: {
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
    },
  };
});

export const useNotificationOpened = () =>
  useNotificationStore((state) => state.opened);

export const useNotificationType = () =>
  useNotificationStore((state) => state.type);

export const useNotificationMessage = () =>
  useNotificationStore((state) => state.message);

export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);

export const notify = useNotificationStore.getState().actions.notify;
