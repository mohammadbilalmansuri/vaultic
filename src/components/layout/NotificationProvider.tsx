"use client";
import { useNotificationStore } from "@/stores/notificationStore";
import { motion, AnimatePresence } from "motion/react";
import { Cancel, Info, Success, Error } from "../icons";

const NotificationProvider = () => {
  const { opened, type, message, closeNotification } = useNotificationStore();

  return (
    <AnimatePresence mode="wait">
      {opened && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="max-w-sm fixed bottom-8 right-8 z-50 bg-zinc-200 dark:bg-zinc-800 heading-color p-5 rounded-2xl flex items-center gap-4 leading-tight border-2 border-zinc-300/50 dark:border-zinc-700/50"
        >
          <div className="flex items-center gap-2">
            {type === "info" && (
              <Info className="w-6 fill-zinc-800 dark:fill-zinc-200" />
            )}
            {type === "success" && <Success className="w-6 fill-teal-500" />}
            {type === "error" && <Error className="w-6 fill-red-500" />}
            <span>{message}</span>
          </div>
          <Cancel
            className="min-w-fit w-3.5 fill-zinc-600 dark:fill-zinc-600 hover:fill-zinc-800 dark:hover:fill-zinc-200 transition-all duration-300"
            onClick={closeNotification}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationProvider;
