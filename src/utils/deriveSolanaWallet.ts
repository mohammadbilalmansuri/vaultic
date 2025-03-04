import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";

const deriveSolanaWallet = async (mnemonic: string, index: number) => {
  const seed = await mnemonicToSeed(mnemonic);
  const derivationPath = `m/44'/501'/${index}'/0'`;
  const derivedSeed = derivePath(derivationPath, seed.toString("hex")).key;
  const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
  const keypair = Keypair.fromSecretKey(secret);

  return {
    address: keypair.publicKey.toBase58(),
    privateKey: bs58.encode(keypair.secretKey),
  };
};

export default deriveSolanaWallet;
