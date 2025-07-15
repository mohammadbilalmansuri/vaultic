import type { Network } from "./types";
import {
  Home,
  Wallet,
  Setting,
  WalletMoney,
  QuestionMark,
} from "@/components/icons";

export const DEFAULT_NETWORK: Network = "ethereum";

export const BALANCE_DISPLAY_DECIMALS = 4;

export const FAUCET_PRESET_AMOUNTS = ["0.5", "1", "2.5", "5"];

export const TRANSACTION_LIMIT = 10;

export const HEADER_NAV_LINKS = (walletExists: boolean) => [
  walletExists
    ? { href: "/dashboard", label: "Dashboard" }
    : { href: "/setup", label: "Wallet Setup" },
  { href: "/faucet", label: "Faucet" },
  { href: "/help-and-support", label: "Help & Support" },
];

export const SIDEBAR_NAV_LINKS = [
  { name: "Dashboard", href: "/dashboard", Icon: Home },
  { name: "Accounts", href: "/accounts", Icon: Wallet },
  { name: "Settings", href: "/settings", Icon: Setting },
  { name: "Faucet", href: "/faucet", Icon: WalletMoney },
  { name: "Help & Support", href: "/help-and-support", Icon: QuestionMark },
];
