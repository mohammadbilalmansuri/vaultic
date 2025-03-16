import { useUserStore, TNetwork } from "@/stores/userStore";
import { useWalletStore } from "@/stores/walletStore";
import deriveWallet from "@/services/deriveWallet";

const useWallet = () => {
  const mnemonic = useUserStore((state) => state.mnemonic);
  const indexes = useUserStore((state) => state.indexes);
  const setState = useUserStore((state) => state.setState);

  const addWallet = useWalletStore((state) => state.addWallet);
  const removeWallet = useWalletStore((state) => state.removeWallet);
  const setWallets = useWalletStore((state) => state.setWallets);
  const updateWalletBalance = useWalletStore(
    (state) => state.updateWalletBalance
  );

  const createWallet = async (network: TNetwork): Promise<void> => {
    const lastIndex =
      indexes
        .filter((w) => w.network === network)
        .reduce((max, w) => Math.max(max, w.index), -1) + 1;

    const wallet = await deriveWallet(mnemonic, lastIndex, network);

    addWallet({ ...wallet, balance: 0 });

    setState({
      indexes: [...indexes, { network, index: lastIndex }],
    });
  };

  const deleteWallet = async (
    index: number,
    network: TNetwork
  ): Promise<void> => {
    removeWallet(index, network);
    setState({
      indexes: indexes.filter(
        (w) => !(w.network === network && w.index === index)
      ),
    });
  };

  const loadWallets = async (): Promise<void> => {
    if (!mnemonic) return;

    const wallets = await Promise.all(
      indexes.map(async ({ network, index }) => {
        const wallet = await deriveWallet(mnemonic, index, network);
        return { ...wallet, balance: 0 };
      })
    );

    setWallets(wallets);
  };

  return { createWallet, deleteWallet, loadWallets, updateWalletBalance };
};

export default useWallet;
