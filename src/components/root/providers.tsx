"use client";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "next-themes";
import type { Children } from "@/types";
import NotificationProvider from "./providers/notification-provider";
import WalletChecker from "./providers/wallet-checker";

const Providers = ({ children }: Children) => {
  return (
    <ThemeProvider
      attribute="class"
      enableSystem={true}
      disableTransitionOnChange={true}
    >
      <div className="root">
        <NextTopLoader color="var(--color-teal-500)" showSpinner={false} />
        <WalletChecker>{children}</WalletChecker>
        <NotificationProvider />
      </div>
    </ThemeProvider>
  );
};

export default Providers;
