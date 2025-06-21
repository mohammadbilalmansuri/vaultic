import BigNumber from "bignumber.js";
import { NETWORKS } from "@/constants";
import { ITransaction, TNetwork, TNetworkMode } from "@/types";
import {
  useWalletStore,
  useAccountsStore,
  useTransactionsStore,
} from "@/stores";
import { useStorage } from "@/hooks";

const useBlockchain = () => {
  const { updateWallet } = useStorage();
  const { setWalletState } = useWalletStore.getState();
  const { getActiveAccount, updateActiveAccount } = useAccountsStore.getState();
  const { setTransactions, addTransaction } = useTransactionsStore.getState();

  const isValidAddress = (network: TNetwork, address: string): boolean => {
    return NETWORKS[network].functions.isValidAddress(address);
  };

  const fetchActiveAccountBalances = async (): Promise<void> => {
    const activeAccount = getActiveAccount();

    const updatedEntries = await Promise.all(
      Object.entries(activeAccount).map(
        async ([networkKey, { address, privateKey, balance }]) => {
          const network = networkKey as TNetwork;
          const { fetchBalance } = NETWORKS[network].functions;
          try {
            const updatedBalance = await fetchBalance(address);
            return [network, { address, privateKey, balance: updatedBalance }];
          } catch (error) {
            console.error(`Failed to fetch balance for ${network}:`, error);
            return [network, { address, privateKey, balance }];
          }
        }
      )
    );

    updateActiveAccount(Object.fromEntries(updatedEntries));
  };

  const fetchActiveAccountTransactions = async (): Promise<void> => {
    const activeAccount = getActiveAccount();

    const transactionEntries = await Promise.all(
      Object.entries(activeAccount).map(async ([networkKey, { address }]) => {
        const network = networkKey as TNetwork;
        const { fetchTransactions } = NETWORKS[network].functions;
        try {
          const transactions = await fetchTransactions(address);
          return [network, transactions];
        } catch (error) {
          console.error(`Failed to fetch transactions for ${network}:`, error);
          return [network, []];
        }
      })
    );

    setTransactions(Object.fromEntries(transactionEntries));
  };

  const sendTokensFromActiveAccount = async ({
    network,
    toAddress,
    amount,
  }: {
    network: TNetwork;
    toAddress: string;
    amount: string;
  }): Promise<ITransaction> => {
    const activeAccount = getActiveAccount();
    const networkAccount = activeAccount[network];
    const { sendTokens } = NETWORKS[network].functions;

    try {
      const transaction = await sendTokens(
        networkAccount.privateKey,
        toAddress,
        amount
      );

      addTransaction(network, transaction);
      updateActiveAccount({
        ...activeAccount,
        [network]: {
          ...networkAccount,
          balance: new BigNumber(networkAccount.balance)
            .minus(new BigNumber(amount).plus(transaction.fee))
            .toString(),
        },
      });

      return transaction;
    } catch (error) {
      console.error(`Error sending ${network} transaction:`, error);
      throw error;
    }
  };

  const refreshActiveAccount = async (): Promise<void> => {
    try {
      await Promise.all([
        fetchActiveAccountBalances(),
        fetchActiveAccountTransactions(),
      ]);
    } catch (error) {
      console.error("Failed to refresh active account:", error);
      throw error;
    }
  };

  const switchNetworkMode = async (mode: TNetworkMode): Promise<void> => {
    try {
      Object.values(NETWORKS).forEach(({ functions: { resetConnection } }) => {
        resetConnection();
      });
      setWalletState({ networkMode: mode });
      await Promise.all([refreshActiveAccount(), updateWallet()]);
    } catch (error) {
      console.error("Failed to switch network mode:", error);
      throw error;
    }
  };

  return {
    isValidAddress,
    fetchActiveAccountBalances,
    fetchActiveAccountTransactions,
    sendTokensFromActiveAccount,
    refreshActiveAccount,
    switchNetworkMode,
  };
};

export default useBlockchain;
