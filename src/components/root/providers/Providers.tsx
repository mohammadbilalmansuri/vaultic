"use client";
import { IChildren } from "@/types";
import NotificationProvider from "./NotificationProvider";
import ThemeProvider from "./ThemeProvider";
import WalletChecker from "./WalletChecker";

const Providers = ({ children }: IChildren) => {
  return (
    <ThemeProvider>
      <WalletChecker>{children}</WalletChecker>
      <NotificationProvider />
    </ThemeProvider>
  );
};

export default Providers;
