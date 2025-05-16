import { TAccount } from "@/types";
import { mnemonicToSeed } from "bip39";
import { deriveEthereumAccount } from "@/services/ethereum";
import { deriveSolanaAccount } from "@/services/solana";

const deriveAccount = async (
  mnemonic: string,
  index: number
): Promise<TAccount> => {
  const seed = await mnemonicToSeed(mnemonic);

  const [solana, ethereum] = await Promise.all([
    deriveSolanaAccount(seed, index),
    deriveEthereumAccount(seed, index),
  ]);

  return { solana, ethereum };
};

export default deriveAccount;
