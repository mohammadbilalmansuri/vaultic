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
} from "@/services/solana";
import useUserStore from "@/stores/userStore";
import { ITxHistoryItem, TNetwork, TNetworkMode } from "@/types";
import { useStorage } from "@/hooks";

const useBlockchain = () => {
  const setUserState = useUserStore((state) => state.setUserState);
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

  const getTxHistory = async ({
    network,
    address,
  }: {
    network: TNetwork;
    address: string;
  }): Promise<ITxHistoryItem[]> => {
    try {
      switch (network) {
        case "solana":
          return getSolanaHistory(address);
        case "ethereum":
          return getEthereumHistory(address);
        default:
          throw new Error("Unsupported network");
      }
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

  return {
    sendTx,
    getBalance,
    getTxHistory,
    switchNetworkMode,
  };
};

export default useBlockchain;
