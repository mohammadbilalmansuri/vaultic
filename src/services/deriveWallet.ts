import { mnemonicToSeed } from "bip39";
import { HDNodeWallet } from "ethers";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { TNetwork } from "@/types";

const deriveWallet = async (
  mnemonic: string,
  index: number,
  network: TNetwork
) => {
  try {
    const seed = await mnemonicToSeed(mnemonic);

    switch (network) {
      case "ethereum": {
        const derivationPath = `m/44'/60'/${index}'/0/0`;
        const hdNode = HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(derivationPath);

        return {
          index,
          network,
          address: child.address,
          privateKey: child.privateKey,
        };
      }

      case "solana": {
        const derivationPath = `m/44'/501'/${index}'/0'`;
        const { key: derivedSeed } = derivePath(
          derivationPath,
          seed.toString("hex")
        );
        const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
        const keypair = Keypair.fromSecretKey(secretKey);

        return {
          index,
          network,
          address: keypair.publicKey.toBase58(),
          privateKey: bs58.encode(keypair.secretKey),
        };
      }

      default:
        throw new Error("Unsupported network");
    }
  } catch (error) {
    throw new Error(
      `Failed to derive wallet: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export default deriveWallet;
