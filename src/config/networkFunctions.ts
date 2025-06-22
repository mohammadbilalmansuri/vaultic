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
