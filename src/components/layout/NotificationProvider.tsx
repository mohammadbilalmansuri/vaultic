"use client";
import useNotificationStore from "@/stores/notificationStore";
import { motion, AnimatePresence } from "motion/react";
import { Cancel, Info, Success, Error } from "@/components/icons";

const NOTIFICATION_ICONS = new Map([
  ["info", <Info className="w-6 fill-zinc-800 dark:fill-zinc-200" />],
  ["success", <Success className="w-6 fill-teal-500" />],
  ["error", <Error className="w-6 fill-rose-500" />],
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
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
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

          <Cancel
            className="min-w-fit fill-zinc-500 hover:fill-zinc-800 dark:hover:fill-zinc-200 transition-all duration-300"
            onClick={closeNotification}
            svgProps={{ className: "w-3.5" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationProvider;
