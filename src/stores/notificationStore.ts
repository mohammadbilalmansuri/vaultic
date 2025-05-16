import { create } from "zustand";
import { INotification } from "@/types";

interface INotificationStore {
  opened: boolean;
  type: INotification["type"];
  message: INotification["message"];
  notify: ({ type, message, duration }: INotification) => void;
  closeNotification: () => void;
}

const useNotificationStore = create<INotificationStore>((set, get) => {
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
