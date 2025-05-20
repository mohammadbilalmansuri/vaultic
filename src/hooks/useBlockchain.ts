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
import { useWalletStore, useAccountsStore } from "@/stores";
import { ITxHistoryItem, TNetwork, TNetworkMode } from "@/types";
import { useStorage } from "@/hooks";

const useBlockchain = () => {
  const { setWalletState } = useWalletStore.getState();
  const { getActiveAccount } = useAccountsStore.getState();
  const { updateWallet } = useStorage();

  const sendTransaction = async ({
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
        case "ethereum":
          return await sendEthereum(fromPrivateKey, toAddress, amount);
        case "solana":
          return await sendSolana(fromPrivateKey, toAddress, amount);
        default:
          throw new Error("Unsupported network");
      }
    } catch (error) {
      console.error(`Error sending ${network} transaction:`, error);
      throw error;
    }
  };

  const fetchBalance = async ({
    network,
    address,
  }: {
    network: TNetwork;
    address: string;
  }): Promise<string> => {
    try {
      switch (network) {
        case "ethereum":
          return await getEthereumBalance(address);
        case "solana":
          return await getSolanaBalance(address);
        default:
          throw new Error("Unsupported network");
      }
    } catch (error) {
      console.error(`Error fetching ${network} balance:`, error);
      throw error;
    }
  };

  const fetchTransactionHistory = async (): Promise<ITxHistoryItem[]> => {
    try {
      const account = getActiveAccount();
      if (!account) throw new Error("No active account found");

      const historyPromises = (
        Object.entries(account) as [TNetwork, { address: string }][]
      ).map(async ([network, { address }]) => {
        switch (network) {
          case "solana":
            return await getSolanaHistory(address);
          case "ethereum":
            return await getEthereumHistory(address);
          default:
            return [];
        }
      });

      const allHistories = await Promise.all(historyPromises);
      const flattened = allHistories.flat();

      return flattened.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      throw error;
    }
  };

  const switchNetworkMode = async (mode: TNetworkMode): Promise<void> => {
    try {
      resetEthereumConnection();
      resetSolanaConnection();
      setWalletState({ networkMode: mode });
      await updateWallet();
    } catch (error) {
      console.error("Error switching network mode:", error);
      throw error;
    }
  };

  const requestAirdrop = async (
    address: string,
    amount: string
  ): Promise<string> => {
    try {
      return await requestSolanaAirdrop(address, amount);
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message.includes("airdrop limit") ||
            error.message.includes("limit")
            ? "You’ve either reached your airdrop limit or the airdrop faucet has run dry. Try again later or use the official faucet."
            : error.message
          : "Airdrop failed. Please try again.";
      console.error("Airdrop error:", error);
      throw new Error(msg);
    }
  };

  return {
    sendTransaction,
    fetchBalance,
    fetchTransactionHistory,
    switchNetworkMode,
    requestAirdrop,
  };
};

export default useBlockchain;
