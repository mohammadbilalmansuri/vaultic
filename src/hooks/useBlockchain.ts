import {
  sendEthereum,
  getEthereumHistory,
  getEthereumBalance,
  resetEthereumConnection,
} from "@/services/ethereum";
import {
  sendSolana,
  getSolanaHistory,
  getSolanaBalance,
  resetSolanaConnection,
  requestSolanaAirdrop,
} from "@/services/solana";
import useUserStore from "@/stores/userStore";
import { ITxHistoryItem, TNetwork, TNetworkMode } from "@/types";
import { useStorage } from "@/hooks";
import useWalletStore from "@/stores/walletStore";

const useBlockchain = () => {
  const setUserState = useUserStore((state) => state.setUserState);
  const wallets = useWalletStore((state) => state.wallets);
  const { saveUserMetadata } = useStorage();

  const sendTx = async ({
    network,
    fromPrivateKey,
    toAddress,
    amount,
  }: {
    network: TNetwork;
    fromPrivateKey: string;
    toAddress: string;
    amount: string;
  }): Promise<string> => {
    try {
      switch (network) {
        case "solana":
          return sendSolana(fromPrivateKey, toAddress, amount);
        case "ethereum":
          return sendEthereum(fromPrivateKey, toAddress, amount);
        default:
          throw new Error("Unsupported network");
      }
    } catch (error: unknown) {
      console.error("Error sending transaction:", error);
      throw error;
    }
  };

  const getBalance = async ({
    network,
    address,
  }: {
    network: TNetwork;
    address: string;
  }): Promise<string> => {
    try {
      switch (network) {
        case "solana":
          return getSolanaBalance(address);
        case "ethereum":
          return getEthereumBalance(address);
        default:
          throw new Error("Unsupported network");
      }
    } catch (error: unknown) {
      console.error("Error fetching balance:", error);
      throw error;
    }
  };

  const getTxHistory = async (): Promise<ITxHistoryItem[]> => {
    try {
      const historyArrays = await Promise.all(
        wallets.values().map(async ({ network, address }) => {
          switch (network) {
            case "solana":
              return await getSolanaHistory(address);
            case "ethereum":
              return await getEthereumHistory(address);
            default:
              return [];
          }
        })
      );

      const history = historyArrays.flat();

      history.sort((a, b) => {
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      });

      return history;
    } catch (error: unknown) {
      console.error("Error fetching transaction history:", error);
      throw error;
    }
  };

  const switchNetworkMode = async (mode: TNetworkMode) => {
    try {
      resetEthereumConnection();
      resetSolanaConnection();
      setUserState({ networkMode: mode });
      await saveUserMetadata();
    } catch (error: unknown) {
      console.error("Error switching network mode:", error);
      throw error;
    }
  };

  const airdropSolana = async (address: string, amount: string) => {
    try {
      return await requestSolanaAirdrop(address, amount);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message.includes("airdrop limit") ||
            error.message.includes("limit")
            ? "You've either reached your airdrop limit or the airdrop faucet has run dry. Try again later or use the official faucet."
            : error.message
          : "Airdrop failed. Please try again."
      );
    }
  };

  return {
    sendTx,
    getBalance,
    getTxHistory,
    switchNetworkMode,
    airdropSolana,
  };
};

export default useBlockchain;
