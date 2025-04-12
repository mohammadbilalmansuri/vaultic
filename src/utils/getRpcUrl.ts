import useUserStore from "@/stores/userStore";
import { TNetwork } from "@/types";
import { RPC_URLs } from "@/constants";
import AppError from "@/utils/appError";

// Returns the RPC URL for the given network based on the selected network mode.
const getRpcUrl = (network: TNetwork): string => {
  const { networkMode } = useUserStore.getState();
  const url = RPC_URLs[network]?.[networkMode];

  if (!url) {
    throw new AppError(
      "Unable to connect to the selected network. Please try again or change network settings.",
      `[getRpcUrl] Missing RPC URL for network: ${network}, mode: ${networkMode}`
    );
  }

  return url;
};

export default getRpcUrl;
