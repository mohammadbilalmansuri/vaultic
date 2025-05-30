"use client";
import { motion, AnimatePresence } from "motion/react";
import { useNotificationStore } from "@/stores";
import { Cancel, Info, Success, Error } from "../ui/icons";

const NOTIFICATION_ICONS = new Map([
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

  return (
    <AnimatePresence mode="wait">
      {opened && (
        <motion.div
          key="notification"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="max-w-lg fixed bottom-8 right-8 z-50 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between gap-4 border-1.5 border-color shadow-xl"
        >
          <div className="flex items-center gap-2.5">
            <span className="min-w-fit">
              {NOTIFICATION_ICONS.get(type || "info")}
            </span>
            <p className="text-zinc-800 dark:text-zinc-200 leading-tight">
              {message}
            </p>
          </div>

          <button type="button" onClick={closeNotification}>
            <Cancel className="icon-btn w-4.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationProvider;
