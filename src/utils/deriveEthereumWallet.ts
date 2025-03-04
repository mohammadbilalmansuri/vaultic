import { mnemonicToSeed } from "bip39";
import { HDNodeWallet, Wallet } from "ethers";

const deriveEthereumWallet = async (mnemonic: string, index: number) => {
  const seed = await mnemonicToSeed(mnemonic);
  const derivationPath = `m/44'/60'/${index}'/0'`;
  const hdNode = HDNodeWallet.fromSeed(seed);
  const child = hdNode.derivePath(derivationPath);
  const privateKey = child.privateKey;
  const wallet = new Wallet(privateKey);
  return wallet;
};

export default deriveEthereumWallet;
