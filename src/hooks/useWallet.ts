import { useUserStore, TNetwork } from "@/stores/userStore";
import { useWalletStore } from "@/stores/walletStore";
import deriveWallet from "@/utils/deriveWallet";

const useWallet = () => {
  const mnemonic = useUserStore((state) => state.mnemonic);
  const walletCounts = useUserStore((state) => state.walletCounts);
  const setState = useUserStore((state) => state.setState);

  const addWallet = useWalletStore((state) => state.addWallet);
  const removeWallet = useWalletStore((state) => state.removeWallet);
  const setWallets = useWalletStore((state) => state.setWallets);
  const updateWalletBalance = useWalletStore(
    (state) => state.updateWalletBalance
  );

  const createWallet = async (network: TNetwork): Promise<void> => {
    const index = walletCounts[network] || 0;
    const wallet = await deriveWallet(mnemonic, index, network);

    const newWallet = {
      ...wallet,
      balance: 0,
    };

    addWallet(newWallet);
    setState({ walletCounts: { ...walletCounts, [network]: index + 1 } });
  };

  const deleteWallet = async (index: number): Promise<void> =>
    removeWallet(index);

  const changeWalletBalance = async (
    index: number,
    balance: number
  ): Promise<void> => updateWalletBalance(index, balance);

  const loadWallets = async (): Promise<void> => {
    if (!mnemonic) return;

    const ethWallets = await Promise.all(
      Array.from({ length: walletCounts.ethereum || 0 }, (_, i) =>
        deriveWallet(mnemonic, i, "ethereum")
      )
    );

    const solWallets = await Promise.all(
      Array.from({ length: walletCounts.solana || 0 }, (_, i) =>
        deriveWallet(mnemonic, i, "solana")
      )
    );

    const allWallets = [...ethWallets, ...solWallets];
    setWallets(allWallets);
  };

  return { createWallet, deleteWallet, loadWallets, changeWalletBalance };
};

export default useWallet;
