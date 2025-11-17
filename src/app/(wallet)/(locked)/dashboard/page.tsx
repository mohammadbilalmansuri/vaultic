import type { Metadata } from "next";
import { DashboardClient } from "./client";

export const metadata: Metadata = {
  title: "Dashboard • Vaultic",
  description:
    "Manage your active account - view balances, send and receive tokens, and track recent transactions across supported networks.",
  alternates: { canonical: "/dashboard" },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
