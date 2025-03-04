import { generateMnemonic as bip39Generate } from "bip39";
import { useUserStore, TNetwork } from "@/stores/userStore";
import { useWalletStore } from "@/stores/walletStore";
import useStorage from "./useStorage";
import deriveEthereumWallet from "@/utils/deriveEthereumWallet";
import deriveSolanaWallet from "@/utils/deriveSolanaWallet";

const useWallet = () => {
  const { status, mnemonic, walletCounts, setState } = useUserStore(
    (state) => ({
      status: state.status,
      mnemonic: state.mnemonic,
      walletCounts: state.walletCounts,
      setState: state.setState,
    })
  );

  const { addWallet, removeWallet, setWallets } = useWalletStore((state) => ({
    addWallet: state.addWallet,
    removeWallet: state.removeWallet,
    setWallets: state.setWallets,
  }));

  const { saveUser } = useStorage();

  const createWallet = async (network: TNetwork) => {
    const index = walletCounts[network];
    const wallet =
      network === "eth"
        ? await deriveEthereumWallet(mnemonic, index)
        : await deriveSolanaWallet(mnemonic, index);

    setState({
      walletCounts: { ...walletCounts, [network]: index + 1 },
    });

    // addWallet(wallet);
    // await saveUser();

    console.log("Wallet created:", wallet);
  };

  // Remove wallet by index
  const deleteWallet = async (index: number) => {
    removeWallet(index);
    await saveUser();
  };

  // Load all wallets from mnemonic
  const loadWallets = () => {
    if (!status || !mnemonic) return;

    const wallets = [];
    for (let i = 0; i < walletCounts.eth; i++) {
      wallets.push(deriveEthereumWallet(mnemonic, i));
    }
    for (let i = 0; i < walletCounts.sol; i++) {
      wallets.push(deriveSolanaWallet(mnemonic, i));
    }

    console.log("Wallets loaded:", wallets);

    // setWallets(wallets);
  };

  return { createWallet, deleteWallet, loadWallets };
};

export default useWallet;
