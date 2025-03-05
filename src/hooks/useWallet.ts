import { useUserStore, TNetwork } from "@/stores/userStore";
import { useWalletStore } from "@/stores/walletStore";
import useStorage from "./useStorage";
import deriveWallet from "@/utils/deriveWallet";

const useWallet = () => {
  const { saveUser } = useStorage();

  const status = useUserStore((state) => state.status);
  const mnemonic = useUserStore((state) => state.mnemonic);
  const walletCounts = useUserStore((state) => state.walletCounts);
  const setState = useUserStore((state) => state.setState);

  const addWallet = useWalletStore((state) => state.addWallet);
  const removeWallet = useWalletStore((state) => state.removeWallet);
  const setWallets = useWalletStore((state) => state.setWallets);
  const updateWalletBalance = useWalletStore(
    (state) => state.updateWalletBalance
  );

  const createWallet = async (network: TNetwork) => {
    const index = walletCounts[network] || 0;
    const wallet = await deriveWallet(mnemonic, index, network);

    const newWallet = {
      ...wallet,
      balance: 0,
    };

    addWallet(newWallet);
    setState({ walletCounts: { ...walletCounts, [network]: index + 1 } });
    await saveUser();
  };

  // Remove wallet by index
  const deleteWallet = async (index: number) => {
    removeWallet(index);
    await saveUser();
  };

  const changeWalletBalance = async (index: number, balance: number) =>
    updateWalletBalance(index, balance);

  // Load all wallets from mnemonic
  const loadWallets = async () => {
    if (!status || !mnemonic) return;

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
    setState({
      walletCounts: { ethereum: ethWallets.length, solana: solWallets.length },
    });
  };

  return { createWallet, deleteWallet, loadWallets, changeWalletBalance };
};

export default useWallet;
