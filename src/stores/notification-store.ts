import { create } from "zustand";
import type { Notification } from "@/types";

interface NotificationState {
  opened: boolean;
  type: "info" | "success" | "error";
  message: string;
}

interface NotificationActions {
  /**
   * Triggers a notification with given type, message and optional duration.
   * If a notification is already open, it fades out before showing the new one.
   *
   * @param type Notification type ('info' | 'success' | 'error').
   * @param message Notification message string.
   * @param duration Duration in milliseconds before auto-dismiss (default: 4000ms).
   */
  notify: ({ type, message, duration }: Notification) => void;

  /** Closes the currently active notification immediately. */
  closeNotification: () => void;
}

interface NotificationStore extends NotificationState {
  actions: NotificationActions;
}

/**
 * Notification store for managing toast notifications with auto-dismiss.
 * Handles queuing and smooth transition between messages.
 */
const useNotificationStore = create<NotificationStore>((set, get) => {
  let timeoutId: NodeJS.Timeout | null = null;

  // Clears any existing timeout and starts a new one
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

/** Returns whether a notification is currently open. */
export const useNotificationOpened = () =>
  useNotificationStore((state) => state.opened);

/** Returns the current notification type ('info', 'success', or 'error'). */
export const useNotificationType = () =>
  useNotificationStore((state) => state.type);

/** Returns the current notification message string. */
export const useNotificationMessage = () =>
  useNotificationStore((state) => state.message);

/**
 * Provides notification actions: `notify` and `closeNotification`.
 * Use `notify()` to trigger a toast; use `closeNotification()` to dismiss.
 */
export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);

/**
 * Shortcut function to trigger notifications outside React components.
 * Does not cause re-renders.
 */
export const notify = useNotificationStore.getState().actions.notify;
