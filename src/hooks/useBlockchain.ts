import { TNetwork, TNetworkMode } from "@/types";
import { useWalletStore, useAccountsStore, useActivityStore } from "@/stores";
import {
  sendEthereum,
  getEthereumActivity,
  getEthereumBalance,
  resetEthereumConnection,
} from "@/services/ethereum";
import {
  sendSolana,
  getSolanaActivity,
  getSolanaBalance,
  resetSolanaConnection,
  requestSolanaAirdrop,
} from "@/services/solana";
import { useStorage } from "@/hooks";

const useBlockchain = () => {
  const { updateWallet } = useStorage();
  const { setWalletState } = useWalletStore.getState();
  const { getActiveAccount, updateActiveAccount } = useAccountsStore.getState();
  const { setActivities } = useActivityStore.getState();

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

  const fetchActiveAccountBalances = async (): Promise<void> => {
    try {
      const activeAccount = getActiveAccount();

      const updatePromises = Object.entries(activeAccount).map(
        async ([network, { address, privateKey, balance }]) => {
          try {
            let newBalance = balance;
            switch (network as TNetwork) {
              case "ethereum":
                newBalance = await getEthereumBalance(address);
                break;
              case "solana":
                newBalance = await getSolanaBalance(address);
                break;
              default:
                break;
            }
            return [network, { address, privateKey, balance: newBalance }];
          } catch (error) {
            console.error(`Error fetching balance for ${network}:`, error);
            return [network, { address, privateKey, balance }];
          }
        }
      );

      const updatedAccount = await Promise.all(updatePromises);
      const updatedAccountObject = Object.fromEntries(updatedAccount);
      updateActiveAccount(updatedAccountObject);
    } catch (error) {
      console.error("Error fetching active account balances:", error);
      throw error;
    }
  };

  const fetchActiveAccountActivity = async (): Promise<void> => {
    try {
      const activeAccount = getActiveAccount();

      const activityPromises = Object.entries(activeAccount).map(
        async ([network, { address }]) => {
          try {
            switch (network) {
              case "ethereum":
                return await getEthereumActivity(address);
              case "solana":
                return await getSolanaActivity(address);
              default:
                return [];
            }
          } catch (error) {
            console.error(`Failed to fetch activity for ${network}:`, error);
            return [];
          }
        }
      );

      const allActivities = (await Promise.all(activityPromises)).flat();

      const sortedActivities = allActivities
        .filter((activity) => activity?.timestamp)
        .sort((a, b) => b.timestamp - a.timestamp);

      setActivities(sortedActivities);
    } catch (error) {
      console.error("Error fetching active account activity:", error);
      throw error;
    }
  };

  const switchNetworkMode = async (mode: TNetworkMode): Promise<void> => {
    try {
      resetEthereumConnection();
      resetSolanaConnection();
      setWalletState({ networkMode: mode });
      await fetchActiveAccountBalances();
      await fetchActiveAccountActivity();
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
        error instanceof Error &&
        (error.message.includes("airdrop limit") ||
          error.message.includes("limit"))
          ? "You’ve either reached your airdrop limit or the airdrop faucet has run dry. Try again later or use the official faucet."
          : "Airdrop failed. Please try again.";

      console.error("Airdrop error:", error);
      throw new Error(msg);
    }
  };

  return {
    sendTransaction,
    fetchActiveAccountBalances,
    fetchActiveAccountActivity,
    switchNetworkMode,
    requestAirdrop,
  };
};

export default useBlockchain;
