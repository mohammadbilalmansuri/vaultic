import { create } from "zustand";

export interface INotification {
  id: number;
  type: "info" | "success" | "warning" | "error";
  message: string;
  timeoutId?: NodeJS.Timeout;
}

export type Position =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

interface NotificationState {
  notifications: INotification[];
  position: Position;
  setPosition: (position: Position) => void;
  addNotification: (message: string, type?: INotification["type"]) => void;
  removeNotification: (id: number) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  position: "bottom-right",

  setPosition: (position) => set({ position }),

  addNotification: (message, type = "info") => {
    const id = Date.now();
    const timeoutId = setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 5000);

    set((state) => ({
      notifications: [...state.notifications, { id, type, message, timeoutId }],
    }));
  },

  removeNotification: (id) =>
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      if (notification?.timeoutId) clearTimeout(notification.timeoutId);
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
      };
    }),

  clearNotifications: () =>
    set((state) => {
      state.notifications.forEach(
        (n) => n.timeoutId && clearTimeout(n.timeoutId)
      );
      return { notifications: [] };
    }),
}));
