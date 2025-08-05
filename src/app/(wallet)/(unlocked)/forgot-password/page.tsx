import type { Metadata } from "next";
import { ForgotPasswordClient } from "./client";

export const metadata: Metadata = {
  title: "Forgot Password | Vaultic",
  description:
    "Reset your Vaultic wallet by re-importing it using your recovery phrase. Securely restore access if you’ve forgotten your password.",
  alternates: { canonical: "/forgot-password" },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
