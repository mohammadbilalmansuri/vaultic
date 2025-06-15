"use client";
import { useState, useEffect } from "react";

const useMounted = (delay = 0): boolean => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timer);
  }, []);

  return mounted;
};

export default useMounted;
