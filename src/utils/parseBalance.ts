import BigNumber from "bignumber.js";
import { BALANCE_DISPLAY_DECIMALS, NETWORKS } from "@/constants";
import { TNetwork } from "@/types";

type ParsedBalanceBase = {
  original: string;
  display: string;
  wasRounded: boolean;
};

type ParsedBalanceWithMax = ParsedBalanceBase & {
  max: string;
};

function parseBalance(balance: string, network: TNetwork): ParsedBalanceWithMax;
function parseBalance(balance: string, network?: undefined): ParsedBalanceBase;

function parseBalance(
  balance: string,
  network?: TNetwork
): ParsedBalanceBase | ParsedBalanceWithMax {
  const bn = new BigNumber(balance.trim());

  if (!bn.isFinite() || bn.isNegative()) {
    return { original: "0", display: "0", wasRounded: false };
  }

  const original = bn.toString();
  const rounded = bn.toFixed(BALANCE_DISPLAY_DECIMALS, BigNumber.ROUND_DOWN);
  const display = new BigNumber(rounded).toString();
  const wasRounded = !bn.eq(rounded);

  const base = { original, display, wasRounded };

  if (network) {
    const { fee, rentExemption } = NETWORKS[network];
    const totalDeductions = new BigNumber(fee).plus(rentExemption);
    const remainingBalance = bn.minus(totalDeductions);
    const max = remainingBalance.isPositive()
      ? remainingBalance.toString()
      : "0";
    return { ...base, max };
  }

  return base;
}

export default parseBalance;
