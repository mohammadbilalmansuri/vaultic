import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers";
import { Header, Footer } from "@/components";

const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  display: "swap",
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
        className={`${ubuntu.className} antialiased w-full min-h-dvh relative bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 tracking-[0.01em]`}
      >
        <ThemeProvider>
          <Header />
          <main className="w-full relative flex flex-col items-center px-4">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
