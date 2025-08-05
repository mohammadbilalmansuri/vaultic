import type { Metadata } from "next";
import { SetupClient } from "./client";

export const metadata: Metadata = {
  title: "Set Up Your Vaultic Wallet",
  description:
    "Create a new crypto wallet or import an existing one with your recovery phrase. Set up your secure Vaultic wallet in just a few simple steps.",
  alternates: { canonical: "/setup" },
};

export default function SetupPage() {
  return <SetupClient />;
}
