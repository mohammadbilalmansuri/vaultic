import { ReactNode } from "react";
import type { Metadata } from "next";
import { Ubuntu_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider, Protected, Header, Footer } from "@/components";

const ubuntuSans = Ubuntu_Sans({
  variable: "--font-ubuntu-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vaultic - Your Crypto, Fortified.",
  description:
    "Vaultic is a secure, web-based cryptocurrency wallet designed for Solana and Ethereum. Built with Next.js and powered by Alchemy RPC, Vaultic enables users to create and manage multiple wallets, send and receive funds, and recover accounts using seed phrases.",
  icons: [
    {
      url: "/vaultic.svg",
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
      <body className={`${ubuntuSans.variable} antialiased`}>
        <ThemeProvider>
          <Header />
          <Protected>{children}</Protected>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
