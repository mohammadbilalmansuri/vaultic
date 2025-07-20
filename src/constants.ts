import type { Network, Icon, NotificationType } from "./types";
import {
  Home,
  Wallet,
  Setting,
  WalletMoney,
  QuestionMark,
  Info,
  Success,
  Error,
} from "@/components/icons";

export const DEFAULT_NETWORK: Network = "ethereum";

export const BALANCE_DISPLAY_DECIMALS = 4;

export const FAUCET_PRESET_AMOUNTS = ["0.5", "1", "2.5", "5"];

export const TRANSACTION_LIMIT = 10;

export const HEADER_NAV_LINKS = (walletExists: boolean) =>
  [
    walletExists
      ? { href: "/dashboard", label: "Dashboard" }
      : { href: "/setup", label: "Wallet Setup" },
    { href: "/faucet", label: "Faucet" },
    { href: "/help-and-support", label: "Help & Support" },
  ] as const;

export const SIDEBAR_NAV_LINKS = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Accounts", href: "/accounts", icon: Wallet },
  { name: "Settings", href: "/settings", icon: Setting },
  { name: "Faucet", href: "/faucet", icon: WalletMoney },
  { name: "Help & Support", href: "/help-and-support", icon: QuestionMark },
] as const;

export const NOTIFICATION_ICONS: Record<
  NotificationType,
  { icon: Icon; colorClassName: string }
> = {
  info: { icon: Info, colorClassName: "text-primary" },
  success: { icon: Success, colorClassName: "text-teal-500" },
  error: { icon: Error, colorClassName: "text-rose-500" },
} as const;
