import { useCallback } from "react";
import {
  sendEthereum,
  getEthereumHistory,
  getEthereumBalance,
} from "@/services/ethereum";
import {
  sendSolana,
  getSolanaHistory,
  getSolanaBalance,
} from "@/services/solana";

export type BlockchainArgs = {
  blockchain: "solana" | "ethereum";
  fromPrivateKey?: string;
  toAddress?: string;
  amount?: string;
  address?: string;
};

export const useBlockchain = () => {
  const sendTx = useCallback(async (args: BlockchainArgs): Promise<string> => {
    switch (args.blockchain) {
      case "solana":
        return await sendSolana(
          args.fromPrivateKey!,
          args.toAddress!,
          args.amount!
        );
      case "ethereum":
        return await sendEthereum(
          args.fromPrivateKey!,
          args.toAddress!,
          args.amount!
        );
      default:
        throw new Error("Unsupported blockchain");
    }
  }, []);

  const getTxHistory = useCallback(
    async (args: BlockchainArgs): Promise<any[]> => {
      switch (args.blockchain) {
        case "solana":
          return await getSolanaHistory(args.address!);
        case "ethereum":
          return await getEthereumHistory(args.address!);
        default:
          throw new Error("Unsupported blockchain");
      }
    },
    []
  );

  const getBalance = useCallback(
    async (args: BlockchainArgs): Promise<string> => {
      switch (args.blockchain) {
        case "solana":
          return await getSolanaBalance(args.address!);
        case "ethereum":
          return await getEthereumBalance(args.address!);
        default:
          throw new Error("Unsupported blockchain");
      }
    },
    []
  );

  return {
    sendTx,
    getTxHistory,
    getBalance,
  };
};
