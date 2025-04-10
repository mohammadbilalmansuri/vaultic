import { useUserStore } from "@/stores/userStore";
import { TNetwork } from "@/types";

const rpcUrls = {
  ethereum: {
    mainnet: process.env.NEXT_PUBLIC_ETH_MAINNET_RPC!,
    devnet: process.env.NEXT_PUBLIC_ETH_SEPOLIA_RPC!,
  },
  solana: {
    mainnet: process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC!,
    devnet: process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC!,
  },
};

const getRpcUrl = (network: TNetwork): string => {
  const { networkMode } = useUserStore.getState();

  const url = rpcUrls[network][networkMode];

  if (!url) {
    throw new Error(`Unsupported network or mode: ${network} - ${networkMode}`);
  }

  return url;
};

export default getRpcUrl;
