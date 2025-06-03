import { RPC_URLs } from "@/constants";
import { TNetwork, TNetworkMode } from "@/types";
import { useWalletStore } from "@/stores";

const getRpcUrl = (network: TNetwork, mode?: TNetworkMode): string => {
  const networkMode = mode ?? useWalletStore.getState().networkMode;
  const url = RPC_URLs[network]?.[networkMode];

  if (!url) {
    throw new Error("RPC URL not found for the specified network and mode");
  }

  return url;
};

export default getRpcUrl;
