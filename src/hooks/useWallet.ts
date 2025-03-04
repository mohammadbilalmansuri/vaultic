import { useUserStore, TNetwork } from "@/stores/userStore";
import { useWalletStore } from "@/stores/walletStore";
import useStorage from "./useStorage";
import deriveEthereumWallet from "@/utils/deriveEthereumWallet";
import deriveSolanaWallet from "@/utils/deriveSolanaWallet";

const useWallet = () => {
  const status = useUserStore((state) => state.status);
  const mnemonic = useUserStore((state) => state.mnemonic);
  const walletCounts = useUserStore((state) => state.walletCounts);
  const setState = useUserStore((state) => state.setState);

  const addWallet = useWalletStore((state) => state.addWallet);
  const removeWallet = useWalletStore((state) => state.removeWallet);
  const setWallets = useWalletStore((state) => state.setWallets);

  const { saveUser } = useStorage();

  const createWallet = async (network: TNetwork) => {
    const index = walletCounts[network] || 0;
    const wallet =
      network === "eth"
        ? await deriveEthereumWallet(mnemonic, index)
        : await deriveSolanaWallet(mnemonic, index);

    const newWallet = {
      index,
      ...wallet,
      network,
      balance: 0,
    };

    addWallet(newWallet);
    // await saveUser();
  };

  // Remove wallet by index
  const deleteWallet = async (index: number) => {
    removeWallet(index);
    await saveUser();
  };

  // Load all wallets from mnemonic
  const loadWallets = async () => {
    if (!status || !mnemonic) return;

    const ethWallets = await Promise.all(
      Array.from({ length: walletCounts.eth || 0 }, (_, i) =>
        deriveEthereumWallet(mnemonic, i)
      )
    );

    const solWallets = await Promise.all(
      Array.from({ length: walletCounts.sol || 0 }, (_, i) =>
        deriveSolanaWallet(mnemonic, i)
      )
    );

    const allWallets = [...ethWallets, ...solWallets];

    // setWallets(allWallets);
    console.log("Wallets loaded:", allWallets);
  };

  return { createWallet, deleteWallet, loadWallets };
};

export default useWallet;
