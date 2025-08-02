import { NETWORKS } from "@/config";
import type { Network } from "@/types";

/**
 * Shortens a blockchain address for display purposes.
 * @param address - Full blockchain address to shorten
 * @param network - Optional network type for prefix handling
 * @param chars - Number of characters to show at start/end (default: 4)
 * @returns Shortened address with ellipsis (e.g., "1234...5678", "0x1234...5678")
 */
const getShortAddress = (
  address: string,
  network?: Network,
  chars = 4
): string => {
  if (!address || address.length <= chars * 2 + 2) return address;
  const prefixLength = network ? NETWORKS[network].addressPrefixLength : 0;
  return `${address.slice(0, chars + prefixLength)}...${address.slice(-chars)}`;
};

export default getShortAddress;
