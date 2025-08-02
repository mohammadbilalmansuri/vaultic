"use client";
import { motion, AnimatePresence } from "motion/react";
import { NOTIFICATION_ICONS } from "@/constants";
import {
  useNotificationOpened,
  useNotificationType,
  useNotificationMessage,
  useNotificationActions,
} from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { Cancel } from "@/components/icons";

const NotificationProvider = () => {
  const opened = useNotificationOpened();
  const type = useNotificationType();
  const message = useNotificationMessage();
  const { closeNotification } = useNotificationActions();

  const { icon: Icon, colorClassName } = NOTIFICATION_ICONS[type || "info"];

  return (
    <AnimatePresence mode="wait">
      {opened && (
        <motion.div
          key="notification"
          {...fadeUpAnimation({
            duration: 0.15,
            ease: "easeInOut",
            withExit: true,
          })}
          className="max-w-xl fixed md:bottom-4 sm:bottom-2 bottom-0 md:right-4 sm:right-2 z-50 m-4 py-4 sm:px-4 px-3 rounded-2xl flex items-center justify-between gap-2.5 bg-primary border-1.5 shadow-xl backdrop-blur-xl"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex items-center gap-2">
            <Icon
              className={cn("shrink-0 sm:w-5.5 w-5", colorClassName)}
              aria-hidden={true}
            />
            <p className="text-primary leading-tight">{message}</p>
          </div>

          <button
            type="button"
            onClick={closeNotification}
            aria-label="Close notification"
            className="-mr-0.5"
          >
            <Cancel className="icon-btn w-4.5 shrink-0" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationProvider;
