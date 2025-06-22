import { NETWORKS } from "@/config";
import { TNetwork, TNetworkMode } from "@/types";
import { useWalletStore } from "@/stores";

const getRpcUrl = (network: TNetwork, mode?: TNetworkMode): string => {
  const networkMode = mode ?? useWalletStore.getState().networkMode;
  const url = NETWORKS[network].rpc[networkMode];

  if (!url) {
    throw new Error(`RPC URL not found for ${network} (${networkMode})`);
  }

  return url;
};

export default getRpcUrl;
