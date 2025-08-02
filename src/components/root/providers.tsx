"use client";
import NextTopLoader from "nextjs-toploader";
import type { Children } from "@/types";
import NotificationProvider from "./providers/notification-provider";
import ThemeProvider from "./providers/theme-provider";
import WalletChecker from "./providers/wallet-checker";

const Providers = ({ children }: Children) => {
  return (
    <ThemeProvider>
      <NextTopLoader color="var(--color-teal-500)" showSpinner={false} />
      <WalletChecker>{children}</WalletChecker>
      <NotificationProvider />
    </ThemeProvider>
  );
};

export default Providers;
