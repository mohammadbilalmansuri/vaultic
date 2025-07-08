import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { IChildren } from "@/types";
import cn from "@/utils/cn";
import { Providers } from "@/components/root";
import "./globals.css";

const inter = Inter({ variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Vaultic - The Wallet That Lives in Your Browser",
  description:
    "Vaultic is a secure, browser-native crypto wallet for Solana and Ethereum. Generate and manage multiple accounts from a single recovery phrase — fully encrypted, open source, and under your complete control.",
  icons: [
    {
      url: "/favicon.svg",
      rel: "icon",
      type: "image/svg+xml",
    },
  ],
  keywords: [
    "vaultic",
    "vaultic wallet",
    "vaultic web wallet",
    "vaultic web3 wallet",
    "vaultic solana wallet",
    "vaultic ethereum wallet",
    "solana",
    "ethereum",
    "wallet",
    "web3",
    "cryptocurrency",
    "blockchain",
    "crypto wallet",
    "web wallet",
    "web-based wallet",
    "web3 wallet",
    "solana wallet",
    "ethereum wallet",
  ],
};

const RootLayout = ({ children }: IChildren) => {
  return (
    <html lang="en">
      <body className={cn(inter.variable, inter.className, "antialiased")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
