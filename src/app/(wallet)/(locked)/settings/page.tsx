import type { Metadata } from "next";
import { SettingsClient } from "./client";

export const metadata: Metadata = {
  title: "Settings • Vaultic",
  description:
    "Security, recovery, and network preferences - view recovery phrase, change password, toggle testnet mode, and remove wallet.",
  alternates: { canonical: "/settings" },
};

export default function SettingsPage() {
  return <SettingsClient />;
}
