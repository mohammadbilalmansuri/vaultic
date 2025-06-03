import { mnemonicToSeed } from "bip39";
import { TAccount } from "@/types";
import { deriveEthereumAccount } from "./ethereum";
import { deriveSolanaAccount } from "./solana";

const deriveAccount = async (
  mnemonic: string,
  index: number
): Promise<TAccount> => {
  const seed = await mnemonicToSeed(mnemonic);

  const [ethereum, solana] = await Promise.all([
    deriveEthereumAccount(seed, index),
    deriveSolanaAccount(seed, index),
  ]);

  return { ethereum, solana };
};

export default deriveAccount;
