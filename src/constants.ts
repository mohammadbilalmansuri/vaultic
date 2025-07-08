import { TNetwork } from "./types";
import {
  Wallet,
  Cards,
  Setting,
  WalletMoney,
  QuestionMark,
} from "@/components/ui/icons";

export const DEFAULT_NETWORK: TNetwork = "ethereum";

export const BALANCE_DISPLAY_DECIMALS = 4;

export const FAUCET_PRESET_AMOUNTS = ["0.5", "1", "2.5", "5"];

export const TRANSACTION_LIMIT = 10;

export const NAVIGATION_HEADER = (walletExists: boolean) => [
  walletExists
    ? { href: "/dashboard", label: "Dashboard" }
    : { href: "/setup", label: "Wallet Setup" },
  { href: "/faucet", label: "Faucet" },
  { href: "/help-and-support", label: "Help & Support" },
];

export const NAVIGATION_SIDEBAR = [
  { name: "Dashboard", href: "/dashboard", Icon: Wallet },
  { name: "Wallet Accounts", href: "/accounts", Icon: Cards },
  { name: "Settings", href: "/settings", Icon: Setting },
  { name: "Faucet", href: "/faucet", Icon: WalletMoney },
  { name: "Help & Support", href: "/help-and-support", Icon: QuestionMark },
];
