"use client";
import { useState, useEffect } from "react";

/**
 * Hook for monitoring network connectivity status.
 * Tracks online/offline state and updates in real-time.
 * @returns Boolean indicating if the user is currently online
 */
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const updateNetworkStatus = () => setIsOnline(navigator.onLine);

  useEffect(() => {
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
  }, []);

  return isOnline;
};

export default useNetworkStatus;
