import { TNetworkFunctions } from "../types";
import {
  resetEthereumConnection,
  isValidEthereumAddress,
  fetchEthereumBalance,
  deriveEthereumAccount,
  fetchEthereumTransactions,
  sendEthereum,
  getEthereumExplorerUrl,
} from "../services/ethereum";
import {
  resetSolanaConnection,
  isValidSolanaAddress,
  fetchSolanaBalance,
  deriveSolanaAccount,
  fetchSolanaTransactions,
  sendSolana,
  getSolanaExplorerUrl,
} from "../services/solana";

/**
 * Network function mapping that provides a unified interface for blockchain operations.
 * Maps each network to its corresponding service functions for consistent API usage.
 */
export const NETWORK_FUNCTIONS: TNetworkFunctions = {
  ethereum: {
    resetConnection: resetEthereumConnection,
    isValidAddress: isValidEthereumAddress,
    fetchBalance: fetchEthereumBalance,
    deriveNetworkAccount: deriveEthereumAccount,
    fetchTransactions: fetchEthereumTransactions,
    sendTokens: sendEthereum,
    getExplorerUrl: getEthereumExplorerUrl,
  },
  solana: {
    resetConnection: resetSolanaConnection,
    isValidAddress: isValidSolanaAddress,
    fetchBalance: fetchSolanaBalance,
    deriveNetworkAccount: deriveSolanaAccount,
    fetchTransactions: fetchSolanaTransactions,
    sendTokens: sendSolana,
    getExplorerUrl: getSolanaExplorerUrl,
  },
};
