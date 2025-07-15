"use client";
import { JSX } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { NotificationType } from "@/types";
import { useNotificationStore } from "@/stores";
import { Cancel, Info, Success, Error } from "@/components/icons";

const NOTIFICATION_ICONS = new Map<NotificationType, JSX.Element>([
  ["info", <Info className="w-5.5 text-zinc-800 dark:text-zinc-200" />],
  ["success", <Success className="w-5.5 text-teal-500" />],
  ["error", <Error className="w-5.5 text-rose-500" />],
]);

const NotificationProvider = () => {
  const opened = useNotificationStore((state) => state.opened);
  const type = useNotificationStore((state) => state.type);
  const message = useNotificationStore((state) => state.message);
  const closeNotification = useNotificationStore(
    (state) => state.closeNotification
  );
  const notificationType = type || "info";

  return (
    <AnimatePresence mode="wait">
      {opened && (
        <motion.div
          key="notification"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="max-w-lg fixed bottom-8 right-8 z-50 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between gap-4 border-1.5 shadow-xl"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex items-center gap-2.5">
            <span
              className="shrink-0"
              aria-label={`${notificationType} notification icon`}
            >
              {NOTIFICATION_ICONS.get(notificationType)}
            </span>
            <p className="text-zinc-800 dark:text-zinc-200 leading-tight">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={closeNotification}
            aria-label="Close notification"
          >
            <Cancel className="icon-btn w-4.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationProvider;
