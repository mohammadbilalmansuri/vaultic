import { create } from "zustand";
import { INotification } from "@/types";

interface NotificationState {
  opened: boolean;
  type: INotification["type"];
  message: string;
  notify: (message: string, type?: INotification["type"]) => void;
  closeNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => {
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
        }, 200);
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
