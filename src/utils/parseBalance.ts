import BigNumber from "bignumber.js";
import { NETWORKS } from "@/config";
import { BALANCE_DISPLAY_DECIMALS } from "@/constants";
import { TNetwork } from "@/types";

type ParsedBalanceBase = {
  original: string;
  display: string;
  wasRounded: boolean;
};

type ParsedBalanceWithMax = ParsedBalanceBase & {
  max: string;
};

/**
 * Parses a balance string into display and calculation formats.
 * When network is provided, calculates maximum sendable amount after deducting fees.
 * @param balance - Raw balance string in readable units (e.g., "1.5" for 1.5 ETH/SOL)
 * @param network - Optional network for fee calculations
 * @returns Parsed balance object with original, display, wasRounded flag, and optionally max amounts
 */

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

  const original = bn.toFixed();
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
