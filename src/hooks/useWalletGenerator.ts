import { useUserStore } from "@/store/user";
import { useWalletStore } from "@/store/wallet";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { HDNodeWallet } from "ethers";
import { Keypair } from "@solana/web3.js";

export function useWalletGenerator() {
  const { mnemonic, walletCounts, setUser } = useUserStore();
  const { setWallets } = useWalletStore();

  function generateNewMnemonic(): string {
    const newMnemonic = generateMnemonic(24);
    return newMnemonic;
  }

  function generateWalletsFromMnemonic(
    mnemonic: string,
    walletCounts: { eth: number; sol: number }
  ) {
    const wallets = [];

    // Generate ETH wallets
    const ethMasterNode = HDNodeWallet.fromMnemonic(mnemonic);
    for (let i = 0; i < walletCounts.eth; i++) {
      const ethWallet = ethMasterNode.derivePath(`m/44'/60'/0'/0/${i}`);
      wallets.push({
        index: i,
        address: ethWallet.address,
        privateKey: ethWallet.privateKey,
        balance: 0,
        network: "ETH",
      });
    }

    // Generate SOL wallets
    for (let i = 0; i < walletCounts.sol; i++) {
      const seed = Uint8Array.from([
        ...mnemonicToSeedSync(mnemonic).slice(0, 32),
        i,
      ]);
      const solWallet = Keypair.fromSeed(seed);
      wallets.push({
        index: i,
        publicKey: solWallet.publicKey.toBase58(),
        privateKey: Buffer.from(solWallet.secretKey).toString("hex"),
        balance: 0,
        network: "SOL",
      });
    }

    return wallets;
  }

  function generateAndSetWallets() {
    if (!mnemonic || !walletCounts) return;

    const wallets = generateWalletsFromMnemonic(mnemonic, walletCounts);
    setWallets(wallets);
  }

  return { generateNewMnemonic, generateAndSetWallets };
}
