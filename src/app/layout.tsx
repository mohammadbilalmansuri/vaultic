import { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ThemeProvider,
  NotificationProvider,
  Header,
  Footer,
  Protected,
  TestnetNotice,
} from "@/components/layout";

const inter = Inter({
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Vaultic - Secure by design. Yours by default.",
  description:
    "Vaultic is a secure, browser-based crypto wallet for Solana and Ethereum. Create multiple wallets with one mnemonic, send assets on testnet and mainnet, and store everything encrypted — no servers, no compromise.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${inter.className} antialiased`}>
        <ThemeProvider>
          <TestnetNotice />
          <Header />
          <main>
            <Protected>{children}</Protected>
          </main>
          <Footer />
          <NotificationProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
