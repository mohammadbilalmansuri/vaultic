import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-primary-100 bg-secondary-50 dark:text-secondary-100 text-primary-100 relative`}
      >
        {children}
      </body>
    </html>
  );
}
