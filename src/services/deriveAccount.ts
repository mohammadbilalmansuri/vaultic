import { mnemonicToSeed } from "bip39";
import { NETWORK_FUNCTIONS } from "@/config";
import { Account } from "@/types";

/**
 * Derives accounts across all supported networks from a mnemonic phrase.
 * @param mnemonic - BIP39 mnemonic phrase
 * @param index - HD wallet derivation index
 * @returns Account object with address, private key, and balance for each network
 */
const deriveAccount = async (
  mnemonic: string,
  index: number
): Promise<Account> => {
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

  return Object.fromEntries(accountEntries) as Account;
};

export default deriveAccount;
