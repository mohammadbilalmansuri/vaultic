import { BALANCE_DECIMALS } from "@/constants";

export const formatBalance = (balance: string): string => {
  const [whole, decimal] = balance.split(".");
  if (!decimal || /^0+$/.test(decimal)) return whole;
  return balance;
};

export const isFixedBalance = (balance: string): boolean => {
  const [, decimal = ""] = balance.trim().split(".");
  return decimal.length <= BALANCE_DECIMALS;
};

export const getFixedBalance = (balance: string): string => {
  const num = Number(balance.trim());
  if (isNaN(num)) return balance;
  return num.toFixed(BALANCE_DECIMALS);
};
