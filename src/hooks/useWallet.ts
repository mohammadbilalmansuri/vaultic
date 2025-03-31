import { useUserStore, TNetwork } from "@/stores/userStore";
import { useWalletStore } from "@/stores/walletStore";
import deriveWallet from "@/services/deriveWallet";
import { useRef } from "react";

const useWallet = () => {
  const addWallet = useWalletStore((state) => state.addWallet);
  const removeWallet = useWalletStore((state) => state.removeWallet);
  const setWallets = useWalletStore((state) => state.setWallets);
  const updateWalletBalance = useWalletStore(
    (state) => state.updateWalletBalance
  );

  const setState = useUserStore((state) => state.setState);
  const isProcessingRef = useRef(false);

  const createWallet = async (network: TNetwork): Promise<void> => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    try {
      const { mnemonic, indexes } = useUserStore.getState();
      const lastIndex =
        indexes
          .filter((w) => w.network === network)
          .reduce((max, w) => Math.max(max, w.index), -1) + 1;

      const wallet = await deriveWallet(mnemonic, lastIndex, network);
      if (!wallet) throw new Error("Failed to derive wallet.");

      addWallet({ ...wallet, balance: 0 });

      setState({
        indexes: [...indexes, { network, index: lastIndex }],
      });
    } catch (error) {
      console.error("Error creating wallet:", error);
    } finally {
      isProcessingRef.current = false;
    }
  };

  const deleteWallet = async (
    index: number,
    network: TNetwork
  ): Promise<void> => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    try {
      const { indexes } = useUserStore.getState();
      removeWallet(index, network);
      setState({
        indexes: indexes.filter(
          (w) => !(w.network === network && w.index === index)
        ),
      });
    } catch (error) {
      console.error("Error deleting wallet:", error);
    } finally {
      isProcessingRef.current = false;
    }
  };

  const loadWallets = async (): Promise<void> => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    try {
      const { mnemonic, indexes } = useUserStore.getState();
      const wallets = await Promise.all(
        indexes.map(async ({ network, index }) => {
          const wallet = await deriveWallet(mnemonic, index, network);
          if (!wallet) throw new Error("Wallet derivation failed.");
          return { ...wallet, balance: 0 };
        })
      );
      setWallets(wallets);
    } catch (error) {
      console.error("Error loading wallets:", error);
    } finally {
      isProcessingRef.current = false;
    }
  };

  return {
    createWallet,
    deleteWallet,
    loadWallets,
    updateWalletBalance,
  };
};

export default useWallet;
