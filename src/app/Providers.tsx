"use client";
import { LayoutProps } from "@/types";
import {
  ThemeProvider,
  NotificationProvider,
  WalletChecker,
} from "@/components/layout";

const Providers = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider>
      <WalletChecker>{children}</WalletChecker>
      <NotificationProvider />
    </ThemeProvider>
  );
};

export default Providers;
