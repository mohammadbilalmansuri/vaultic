import BigNumber from "bignumber.js";
import { BALANCE_DECIMALS, NETWORKS, TNetwork } from "@/constants";

const parseBalance = (
  balance: string,
  network?: TNetwork
): {
  original: string;
  display: string;
  max?: string;
  wasRounded: boolean;
} => {
  const bn = new BigNumber(balance.trim());

  if (!bn.isFinite() || bn.isNegative()) {
    return { original: "0", display: "0", wasRounded: false };
  }

  const original = bn.toString();

  const rounded = bn.toFixed(BALANCE_DECIMALS, BigNumber.ROUND_DOWN);
  const display = new BigNumber(rounded).toString();
  const wasRounded = !bn.eq(rounded);

  const result = { original, display, wasRounded } as const;

  if (network && NETWORKS[network]) {
    const fee = new BigNumber(NETWORKS[network].fee ?? 0);
    const max = BigNumber.max(bn.minus(fee), 0).toString();
    return { ...result, max };
  }

  return result;
};

export default parseBalance;
