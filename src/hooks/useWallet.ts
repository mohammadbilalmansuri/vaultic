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
      const { mnemonic, indexes, deletedIndexes } = useUserStore.getState();

      const deletedSet = new Set(
        deletedIndexes
          .filter((entry) => entry.network === network)
          .map((entry) => entry.index)
      );

      const networkIndexes = indexes
        .filter((entry) => entry.network === network)
        .map((entry) => entry.index);

      let lastIndex =
        networkIndexes.length > 0 ? Math.max(...networkIndexes) + 1 : 0;

      if (networkIndexes.length === 0 && deletedSet.size > 0) {
        lastIndex = Math.max(...deletedSet) + 1;
      }

      while (deletedSet.has(lastIndex)) {
        lastIndex += 1;
      }

      const wallet = await deriveWallet(mnemonic, lastIndex, network);
      if (!wallet) throw new Error("Failed to derive wallet");

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
      const { indexes, deletedIndexes } = useUserStore.getState();

      if (indexes.length === 1) {
        throw new Error(
          "Cannot delete the last remaining wallet. You must have at least one wallet."
        );
      }

      removeWallet(index, network);
      setState({
        indexes: indexes.filter(
          (w) => !(w.network === network && w.index === index)
        ),
        deletedIndexes: [...deletedIndexes, { network, index }],
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
          try {
            const wallet = await deriveWallet(mnemonic, index, network);
            if (!wallet)
              throw new Error(
                `Wallet derivation failed for ${network} index ${index}`
              );
            return { ...wallet, balance: 0 };
          } catch (error) {
            console.warn(
              `Skipped wallet ${network}-${index} due to error:`,
              error
            );
            return null;
          }
        })
      );

      setWallets(wallets.filter((w) => w !== null));
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
