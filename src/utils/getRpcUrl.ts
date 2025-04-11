import useUserStore from "@/stores/userStore";
import { TNetwork } from "@/types";
import { RPC_URLs } from "@/constants";

const getRpcUrl = (network: TNetwork): string => {
  const { networkMode } = useUserStore.getState();

  const url = RPC_URLs[network][networkMode];

  if (!url) {
    throw new Error(`Unsupported network or mode: ${network} - ${networkMode}`);
  }

  return url;
};

export default getRpcUrl;
