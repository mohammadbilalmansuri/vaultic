import BigNumber from "bignumber.js";
import { NETWORK_FUNCTIONS } from "@/config";
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
    return NETWORK_FUNCTIONS[network].isValidAddress(address);
  };

  const fetchActiveAccountBalances = async (): Promise<void> => {
    const activeAccount = getActiveAccount();

    const updatedEntries = await Promise.all(
      Object.entries(activeAccount).map(
        async ([networkKey, { address, privateKey, balance }]) => {
          const network = networkKey as TNetwork;
          const { fetchBalance } = NETWORK_FUNCTIONS[network];
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
        const { fetchTransactions } = NETWORK_FUNCTIONS[network];
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
    const { sendTokens } = NETWORK_FUNCTIONS[network];

    try {
      const transaction = await sendTokens(
        networkAccount.privateKey,
        toAddress,
        amount
      );

      const totalDeduct = new BigNumber(amount).plus(transaction.fee);
      const updatedBalance = new BigNumber(networkAccount.balance)
        .minus(totalDeduct)
        .toString();

      updateActiveAccount({
        ...activeAccount,
        [network]: {
          ...networkAccount,
          balance: updatedBalance,
        },
      });

      addTransaction(network, transaction);

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
      Object.values(NETWORK_FUNCTIONS).forEach(({ resetConnection }) => {
        resetConnection();
      });
      setWalletState({ networkMode: mode });
      await updateWallet();
      await refreshActiveAccount();
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
