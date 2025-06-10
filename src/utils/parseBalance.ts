import BigNumber from "bignumber.js";
import { BALANCE_DECIMALS, NETWORKS, TNetwork } from "@/constants";

const parseBalance = (
  balance: string,
  network?: TNetwork
): {
  raw: string;
  fixed: string;
  max?: string;
  isFixed: boolean;
} => {
  const raw = balance.trim();
  const bn = new BigNumber(raw);

  if (!bn.isFinite() || bn.isNegative()) {
    return { raw: "0", fixed: "0", isFixed: true };
  }

  const fixed = bn.toFixed(BALANCE_DECIMALS, BigNumber.ROUND_DOWN);
  const isFixed = bn.eq(new BigNumber(fixed));

  if (network && network in NETWORKS) {
    const fee = new BigNumber(NETWORKS[network].fee ?? 0);
    const max = BigNumber.max(bn.minus(fee), 0).toString();
    return { raw, fixed, max, isFixed };
  }

  return { raw, fixed, isFixed };
};

export default parseBalance;
