import BigNumber from "bignumber.js";
import { BALANCE_DECIMALS, NETWORKS, TNetwork } from "@/constants";

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
  const rounded = bn.toFixed(BALANCE_DECIMALS, BigNumber.ROUND_DOWN);
  const display = new BigNumber(rounded).toString();
  const wasRounded = !bn.eq(rounded);

  const base = { original, display, wasRounded };

  if (network && NETWORKS[network]) {
    const fee = new BigNumber(NETWORKS[network].fee ?? 0);
    const max = BigNumber.max(bn.minus(fee), 0).toString();
    return { ...base, max };
  }

  return base;
}

export default parseBalance;
