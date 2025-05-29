import { BALANCE_DECIMALS } from "@/constants";

const parseBalance = (
  balance: string
): { original: string; fixed: string; isFixed: boolean } => {
  const trimmed = balance.trim();
  const num = Number(trimmed);
  if (isNaN(num)) return { original: trimmed, fixed: trimmed, isFixed: true };

  const originalCleaned = parseFloat(num.toFixed(18)).toString();
  const fixedBalance = parseFloat(num.toFixed(BALANCE_DECIMALS)).toString();
  const isFixed = originalCleaned === fixedBalance;

  return { original: originalCleaned, fixed: fixedBalance, isFixed };
};

export default parseBalance;
