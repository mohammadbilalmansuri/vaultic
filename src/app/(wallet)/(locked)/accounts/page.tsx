import type { Metadata } from "next";
import { AccountsClient } from "./client";

export const metadata: Metadata = {
  title: "Accounts • Vaultic",
  description:
    "Manage your accounts — create new accounts, switch active account, and view keypairs derived from your recovery phrase.",
  alternates: { canonical: "/accounts" },
};

export default function AccountsPage() {
  return <AccountsClient />;
}
