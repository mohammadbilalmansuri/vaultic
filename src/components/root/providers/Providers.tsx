"use client";
import NextTopLoader from "nextjs-toploader";
import type { Children } from "@/types";
import NotificationProvider from "./NotificationProvider";
import ThemeProvider from "./ThemeProvider";
import WalletChecker from "./WalletChecker";

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
