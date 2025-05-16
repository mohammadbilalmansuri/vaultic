"use client";
import { motion } from "motion/react";
import useWalletStore from "@/stores/walletStore";
import {
  Solana,
  Ethereum,
  Trash,
  AngleDown,
  Cancel,
  Wallet,
} from "@/components/ui/icons";
import { NETWORK_TOKENS } from "@/constants";
import { Button } from "@/components/ui";
import { useState, useTransition } from "react";
import { useClipboard, useStorage, useWallet, useBlockchain } from "@/hooks";
import { CopyToggle, EyeToggle, Loader } from "@/components/ui";
import cn from "@/utils/cn";
import getShortAddress from "@/utils/getShortAddress";
import { TNetwork } from "@/types";
import useNotificationStore from "@/stores/notificationStore";
import WalletCard from "@/components/common/Wallet";

const Wallets = () => {
  const notify = useNotificationStore((state) => state.notify);
  const wallets = useWalletStore((state) => state.wallets);
  const copyToClipboard = useClipboard();
  const { createWallet, deleteWallet, updateWalletBalance } = useWallet();
  const { saveUserMetadata } = useStorage();
  const { getBalance } = useBlockchain();
  const [addressCopied, setAddressCopied] = useState(false);
  const [privateKeyCopied, setPrivateKeyCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [privateKeyHidden, setPrivateKeyHidden] = useState(true);
  const [addingWallet, setAddingWallet] = useState<TNetwork | boolean>(false);
  const [refreshing, startRefreshing] = useTransition();

  const handleAddWallet = async (network: TNetwork) => {
    setAddingWallet(network);
    try {
      await createWallet(network);
      await saveUserMetadata();
      notify({ type: "success", message: `New ${network} wallet added!` });
    } catch {
      notify({ type: "error", message: `Failed to add ${network} wallet.` });
    } finally {
      setAddingWallet(false);
    }
  };

  const handleDeleteWallet = async (
    network: TNetwork,
    index: number,
    address: string
  ) => {
    try {
      await deleteWallet(network, index, address);
      await saveUserMetadata();
      notify({
        type: "success",
        message: `${network} Wallet ${index + 1} deleted.`,
      });
    } catch {
      notify({ type: "error", message: `Failed to delete wallet.` });
    }
  };

  const handleBalanceRefresh = () => {
    startRefreshing(async () => {
      try {
        await Promise.all(
          [...wallets.values()].map(async ({ address, network }) => {
            updateWalletBalance(
              address,
              await getBalance({ address, network })
            );
          })
        );
        notify({ type: "success", message: "Balances refreshed!" });
      } catch {
        notify({ type: "error", message: "Failed to refresh balances." });
      }
    });
  };

  return (
    <div className="w-full max-w-screen-lg relative flex flex-col items-center flex-1 gap-5 py-5">
      <div className="w-full flex items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <Wallet className="h-8 heading-color" />
          <h2 className="text-2xl font-medium heading-color">Your Wallets</h2>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="zinc"
            size="sm"
            disabled={refreshing}
            onClick={handleBalanceRefresh}
            className="gap-3 w-42"
          >
            {refreshing ? <Loader size="xs" /> : "Refresh Balances"}
          </Button>
          <div className="w-42 relative flex items-center justify-center">
            {addingWallet ? (
              <div className="w-full h-11 border-1.5 border-color rounded-2xl grid grid-cols-3 gap-2 overflow-hidden">
                <button
                  className="bg-primary flex items-center justify-center rounded-xl hover:bg-secondary transition-colors duration-300"
                  onClick={() => handleAddWallet("solana")}
                >
                  {addingWallet === "solana" ? (
                    <Loader size="xs" />
                  ) : (
                    <Solana className="h-4" />
                  )}
                </button>
                <button
                  className="bg-primary flex items-center justify-center rounded-xl hover:bg-secondary transition-colors duration-300"
                  onClick={() => handleAddWallet("ethereum")}
                >
                  {addingWallet === "ethereum" ? (
                    <Loader size="xs" />
                  ) : (
                    <Ethereum className="h-6" />
                  )}
                </button>
                <button
                  className="bg-primary flex items-center justify-center rounded-xl hover:bg-secondary transition-colors duration-300"
                  onClick={() => setAddingWallet(false)}
                >
                  <Cancel className="w-6" />
                </button>
              </div>
            ) : (
              <Button
                size="sm"
                className="w-full"
                onClick={() => setAddingWallet(true)}
              >
                Add new wallet
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-2 gap-5">
        {[...wallets.values()].map(
          ({ address, privateKey, index, balance, network }) => (
            <WalletCard
              key={address}
              address={address}
              privateKey={privateKey}
              index={index}
              balance={balance}
              network={network}
              onDelete={handleDeleteWallet}
              copyToClipboard={copyToClipboard}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Wallets;
