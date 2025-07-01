import BigNumber from "bignumber.js";
import { NETWORK_FUNCTIONS } from "@/config";
import { ITransaction, TNetwork, TNetworkMode } from "@/types";
import {
  useWalletStore,
  useAccountsStore,
  useTransactionsStore,
  useNotificationStore,
} from "@/stores";
import { useStorage } from "@/hooks";

/**
 * Blockchain interaction hook for unified account and transaction management.
 *
 * Provides helpers for:
 * - Validating wallet addresses
 * - Fetching account balances
 * - Sending tokens
 * - Refreshing account data
 * - Switching network modes (mainnet/testnet)
 */
const useBlockchain = () => {
  const { updateWallet } = useStorage();
  const { setWalletState } = useWalletStore.getState();
  const { getActiveAccount, updateActiveAccount } = useAccountsStore.getState();
  const { setTransactions, addTransaction } = useTransactionsStore.getState();
  const { notify } = useNotificationStore.getState();

  /**
   * Validates whether an address is valid for the given blockchain network.
   *
   * @param {TNetwork} network - The target blockchain network (e.g., 'solana', 'ethereum').
   * @param {string} address - The wallet address to validate.
   * @returns {boolean} `true` if the address is valid for the network, otherwise `false`.
   */
  const isValidAddress = (network: TNetwork, address: string): boolean => {
    return NETWORK_FUNCTIONS[network].isValidAddress(address);
  };

  /**
   * Fetches and updates balances for all networks in the active account.
   * Stores the updated balances in the accounts store.
   *
   * @returns {Promise<void>} A promise that resolves after balances are updated.
   */
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

  /**
   * Fetches and updates transaction history for all networks in the active account.
   * Stores the latest transactions in the transactions store.
   *
   * @returns {Promise<void>} A promise that resolves after transactions are updated.
   */
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

  /**
   * Sends tokens from the active account on the specified network.
   * Updates account balance and transaction history upon success.
   *
   * @param {Object} params - The send transaction parameters.
   * @param {TNetwork} params.network - The network to send tokens on.
   * @param {string} params.toAddress - The recipient address.
   * @param {string} params.amount - The amount to send (in base units, e.g., SOL or ETH).
   * @returns {Promise<ITransaction>} The resulting transaction object.
   */
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
        [network]: { ...networkAccount, balance: updatedBalance },
      });

      addTransaction(network, transaction);

      return transaction;
    } catch (error) {
      console.error(`Error sending ${network} transaction:`, error);
      throw error;
    }
  };

  /**
   * Refreshes the active account's data:
   * - Fetches latest balances
   * - Fetches latest transaction history
   *
   * @returns {Promise<void>} A promise that resolves after data is refreshed.
   */
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

  /**
   * Switches between network modes (mainnet ↔ testnet) for all networks.
   * - Resets network connections
   * - Updates wallet state
   * - Refreshes account balances and transactions
   * - Shows error notification on failure
   *
   * @returns {Promise<void>} A promise that resolves after the mode switch is complete.
   */
  const switchNetworkMode = async (): Promise<void> => {
    const { networkMode } = useWalletStore.getState();
    const switchToMode = networkMode === "mainnet" ? "testnet" : "mainnet";

    try {
      for (const { resetConnection } of Object.values(NETWORK_FUNCTIONS)) {
        resetConnection();
      }

      setWalletState({ networkMode: switchToMode });

      await updateWallet();
      await refreshActiveAccount();
    } catch (error) {
      notify({
        type: "error",
        message: "Failed to switch network mode. Please try again.",
      });
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
