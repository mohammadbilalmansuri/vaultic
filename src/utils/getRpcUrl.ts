import useUserStore from "@/stores/userStore";
import { TNetwork, TNetworkMode } from "@/types";
import { RPC_URLs } from "@/constants";

const getRpcUrl = (network: TNetwork, mode?: TNetworkMode): string => {
  const networkMode = mode ?? useUserStore.getState().networkMode;
  const url = RPC_URLs[network]?.[networkMode];

  if (!url) {
    throw new Error("RPC URL not found for the specified network and mode");
  }

  return url;
};

export default getRpcUrl;
