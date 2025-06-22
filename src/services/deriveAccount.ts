import { mnemonicToSeed } from "bip39";
import { NETWORK_FUNCTIONS } from "@/config";
import { TAccount } from "@/types";

const deriveAccount = async (
  mnemonic: string,
  index: number
): Promise<TAccount> => {
  const seed = await mnemonicToSeed(mnemonic);

  const accountEntries = await Promise.all(
    Object.entries(NETWORK_FUNCTIONS).map(
      async ([network, { deriveNetworkAccount }]) => {
        const { address, privateKey, balance } = await deriveNetworkAccount(
          seed,
          index
        );
        return [network, { address, privateKey, balance }] as const;
      }
    )
  );

  return Object.fromEntries(accountEntries) as TAccount;
};

export default deriveAccount;
