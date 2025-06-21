import { mnemonicToSeed } from "bip39";
import { NETWORKS } from "@/constants";
import { TAccount } from "@/types";

const deriveAccount = async (
  mnemonic: string,
  index: number
): Promise<TAccount> => {
  const seed = await mnemonicToSeed(mnemonic);

  const accountEntries = await Promise.all(
    Object.values(NETWORKS).map(
      async ({ id, functions: { deriveNetworkAccount } }) => {
        const { address, privateKey } = await deriveNetworkAccount(seed, index);
        return [id, { address, privateKey, balance: "0" }] as const;
      }
    )
  );

  return Object.fromEntries(accountEntries) as TAccount;
};

export default deriveAccount;
