import { create } from "zustand";

interface Notification {
  message: string;
  type: "info" | "success" | "error";
}

interface NotificationStore {
  opened: boolean;
  type: Notification["type"];
  message: string;
  notify: (message: string, type?: Notification["type"]) => void;
  closeNotification: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => {
  let timeoutId: NodeJS.Timeout | null = null;

  const startTimer = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => get().closeNotification(), 4000);
  };

  return {
    opened: false,
    type: "info",
    message: "",

    notify: (message, type = "info") => {
      const { opened } = get();

      if (opened) {
        set({ opened: false });

        setTimeout(() => {
          set({ opened: true, message, type });
          startTimer();
        }, 400);
      } else {
        set({ opened: true, message, type });
        startTimer();
      }
    },

    closeNotification: () => {
      if (timeoutId) clearTimeout(timeoutId);
      set({ opened: false, message: "", type: "info" });
    },
  };
});
