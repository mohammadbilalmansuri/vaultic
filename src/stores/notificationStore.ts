import { create } from "zustand";
import { INotification } from "@/types";

interface NotificationState {
  opened: boolean;
  type: INotification["type"];
  message: INotification["message"];
  notify: ({ type, message }: INotification) => void;
  closeNotification: () => void;
}

const useNotificationStore = create<NotificationState>((set, get) => {
  let timeoutId: NodeJS.Timeout | null = null;

  const startTimer = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => get().closeNotification(), 4000);
  };

  return {
    opened: false,
    type: "info",
    message: "",

    notify: ({ type = "info", message }) => {
      const { opened } = get();

      if (opened) {
        set({ opened: false });

        setTimeout(() => {
          set({ opened: true, type, message });
          startTimer();
        }, 400);
      } else {
        set({ opened: true, type, message });
        startTimer();
      }
    },

    closeNotification: () => {
      if (timeoutId) clearTimeout(timeoutId);
      set({ opened: false, type: "info", message: "" });
    },
  };
});

export default useNotificationStore;
