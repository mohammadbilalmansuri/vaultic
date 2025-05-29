import { TNetwork } from "@/types";

const getShortAddress = (
  address: string,
  network: TNetwork,
  chars = 4
): string => {
  if (!address || address.length <= chars * 2 + 2) return address;
  return `${address.slice(
    0,
    network === "ethereum" ? chars + 2 : chars
  )}...${address.slice(-chars)}`;
};

export default getShortAddress;
