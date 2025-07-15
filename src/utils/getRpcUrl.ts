import { NETWORKS } from "@/config";
import type { Network, NetworkMode } from "@/types";
import { useWalletStore } from "@/stores";

/**
 * Gets the RPC URL for a specific network and mode.
 * @param network - Target blockchain network
 * @param mode - Optional network mode (mainnet/testnet), defaults to current wallet mode
 * @returns RPC URL string for the specified network and mode
 * @throws {Error} When RPC URL is not configured for the network/mode combination
 */
const getRpcUrl = (network: Network, mode?: NetworkMode): string => {
  const networkMode = mode ?? useWalletStore.getState().networkMode;
  const url = NETWORKS[network].rpc[networkMode];

  if (!url) {
    throw new Error(`RPC URL not found for ${network} (${networkMode})`);
  }

  return url;
};

export default getRpcUrl;
