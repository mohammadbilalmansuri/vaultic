import { ITransaction, TNetwork, TNetworkMode } from "@/types";
import {
  useWalletStore,
  useAccountsStore,
  useTransactionsStore,
} from "@/stores";
import {
  sendEthereum,
  getEthereumTransactions,
  getEthereumBalance,
  resetEthereumConnection,
  isValidEthereumAddress,
} from "@/services/ethereum";
import {
  sendSolana,
  getSolanaTransactions,
  getSolanaBalance,
  resetSolanaConnection,
  requestSolanaAirdrop,
  isValidSolanaAddress,
} from "@/services/solana";
import { useStorage } from "@/hooks";

const useBlockchain = () => {
  const { updateWallet } = useStorage();
  const { setWalletState } = useWalletStore.getState();
  const { getActiveAccount, updateActiveAccount } = useAccountsStore.getState();
  const { setTransactions } = useTransactionsStore.getState();

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
  }): Promise<ITransaction> => {
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
  const fetchActiveAccountTransactions = async (): Promise<void> => {
    try {
      const activeAccount = getActiveAccount();

      const transactionResults = await Promise.all(
        Object.entries(activeAccount).map(async ([networkKey, { address }]) => {
          const network = networkKey as TNetwork;
          let transactions: ITransaction[];

          switch (network) {
            case "ethereum":
              transactions = await getEthereumTransactions(address);
              break;
            case "solana":
              transactions = await getSolanaTransactions(address);
              break;
            default:
              transactions = [];
          }

          return [network, transactions];
        })
      );

      setTransactions(Object.fromEntries(transactionResults));
    } catch (error) {
      console.error("Error fetching active account transactions:", error);
      throw error;
    }
  };

  const switchNetworkMode = async (mode: TNetworkMode): Promise<void> => {
    try {
      resetEthereumConnection();
      resetSolanaConnection();
      setWalletState({ networkMode: mode });
      await fetchActiveAccountBalances();
      await fetchActiveAccountTransactions();
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
      const message =
        error instanceof Error &&
        (error.message.includes("airdrop limit") ||
          error.message.includes("limit"))
          ? "You’ve either reached your airdrop limit or the airdrop faucet has run dry. Try again later or use the official faucet."
          : "Airdrop failed. Please try again.";

      console.error("Airdrop error:", error);
      throw new Error(message);
    }
  };

  const isValidAddress = (network: TNetwork, address: string): boolean => {
    switch (network) {
      case "ethereum":
        return isValidEthereumAddress(address);
      case "solana":
        return isValidSolanaAddress(address);
      default:
        console.warn(`Unsupported network for address validation: ${network}`);
        return false;
    }
  };

  return {
    sendTransaction,
    fetchActiveAccountBalances,
    fetchActiveAccountTransactions,
    switchNetworkMode,
    requestAirdrop,
    isValidAddress,
  };
};

export default useBlockchain;
