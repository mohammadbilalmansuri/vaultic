import useUserStore from "@/stores/userStore";
import useWalletStore from "@/stores/walletStore";
import deriveWallet from "@/services/deriveWallet";
import { TNetwork } from "@/types";
import { useBlockchain } from "@/hooks";

const useWallet = () => {
  const { setWallets, addWallet, removeWallet, updateWalletBalance } =
    useWalletStore.getState();
  const { setUserState } = useUserStore.getState();

  const { getBalance } = useBlockchain();

  let isProcessing = false;

  const createWallet = async (network: TNetwork): Promise<void> => {
    if (isProcessing) return;
    isProcessing = true;

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

      const balance = await getBalance({
        network,
        address: wallet.address,
      });

      addWallet({ ...wallet, balance });

      setUserState({
        indexes: [...indexes, { network, index: lastIndex }],
      });
    } catch (error) {
      console.error("Error creating wallet:", error);
      throw error;
    } finally {
      isProcessing = false;
    }
  };

  const deleteWallet = async (
    network: TNetwork,
    index: number,
    address: string
  ): Promise<void> => {
    if (isProcessing) return;
    isProcessing = true;

    try {
      const { indexes, deletedIndexes } = useUserStore.getState();

      if (indexes.length === 1) {
        throw new Error(
          "You must have at least one wallet. Deleting the last wallet is not allowed."
        );
      }

      removeWallet(address);
      setUserState({
        indexes: indexes.filter(
          (w) => !(w.network === network && w.index === index)
        ),
        deletedIndexes: [...deletedIndexes, { network, index }],
      });
    } catch (error) {
      console.error("Error deleting wallet:", error);
      throw error;
    } finally {
      isProcessing = false;
    }
  };

  const loadWallets = async (): Promise<void> => {
    if (isProcessing) return;
    isProcessing = true;

    try {
      const { mnemonic, indexes } = useUserStore.getState();

      const wallets = await Promise.all(
        indexes.map(async ({ network, index }) => {
          try {
            const wallet = await deriveWallet(mnemonic, index, network);

            if (!wallet) {
              throw new Error(
                `Wallet derivation failed for ${network} index ${index}`
              );
            }

            const balance = await getBalance({
              network,
              address: wallet.address,
            });

            return { ...wallet, balance };
          } catch (error) {
            console.warn(
              `Skipped wallet ${network}-${index} due to error:`,
              error
            );
            return null;
          }
        })
      );

      setWallets(
        new Map(
          wallets
            .filter((w) => w !== null)
            .map((wallet) => [wallet.address, wallet])
        )
      );
    } catch (error) {
      console.error("Error loading wallets:", error);
      throw error;
    } finally {
      isProcessing = false;
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
