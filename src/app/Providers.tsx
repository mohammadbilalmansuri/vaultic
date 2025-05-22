"use client";
import { IChildren } from "@/types";
import {
  ThemeProvider,
  NotificationProvider,
  WalletChecker,
} from "@/components/layout";

const Providers = ({ children }: IChildren) => {
  return (
    <ThemeProvider>
      <WalletChecker>{children}</WalletChecker>
      <NotificationProvider />
    </ThemeProvider>
  );
};

export default Providers;
