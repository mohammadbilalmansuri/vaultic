"use client";
import { memo, useState } from "react";
import { useNotificationStore } from "@/stores/notificationStore";
import { motion, AnimatePresence } from "motion/react";

const positionStyles = {
  "top-left": "top-5 left-5 items-start",
  "top-right": "top-5 right-5 items-end",
  "bottom-left": "bottom-5 left-5 items-start",
  "bottom-right": "bottom-5 right-5 items-end",
};

const NotificationProvider = memo(() => {
  const { notifications, removeNotification, clearNotifications, position } =
    useNotificationStore();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`fixed flex flex-col space-y-2 z-50 ${positionStyles[position]}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isHovered
                ? 1
                : index === notifications.length - 1
                ? 1
                : 0.5,
              y: 0,
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`relative w-80 p-4 rounded-lg shadow-lg flex items-start justify-between transition-all 
              ${
                notification.type === "success"
                  ? "bg-green-500 text-white"
                  : notification.type === "error"
                  ? "bg-red-500 text-white"
                  : notification.type === "warning"
                  ? "bg-yellow-500 text-black"
                  : "bg-blue-500 text-white"
              }`}
            style={{
              transform: `translateY(${isHovered ? 0 : index * -8}px)`,
              zIndex: notifications.length - index,
            }}
          >
            <span>{notification.message}</span>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4"
            >
              X
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Clear All Button */}
      {notifications.length > 1 && (
        <button
          onClick={clearNotifications}
          className="mt-2 w-full bg-gray-800 text-white py-2 rounded-md text-sm"
        >
          Clear All
        </button>
      )}
    </div>
  );
});

export default NotificationProvider;
