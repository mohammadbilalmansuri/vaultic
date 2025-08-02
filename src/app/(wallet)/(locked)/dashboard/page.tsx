import type { Metadata } from "next";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard - Vaultic",
  description:
    "Wallet dashboard for viewing balances, sending/receiving crypto, and managing transactions across networks.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
