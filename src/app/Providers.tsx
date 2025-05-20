"use client";
import { LayoutProps } from "@/types";
import { ThemeProvider, NotificationProvider } from "@/components/layout";

const Providers = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider>
      {children}
      <NotificationProvider />
    </ThemeProvider>
  );
};

export default Providers;
