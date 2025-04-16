"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button, Loader } from "@/components/ui";
import { Solana, Ethereum, Cancel } from "@/components/ui/icons";
import { Wallet } from "@/components/dashboard";
import { useWallet, useStorage } from "@/hooks";
import useWalletStore from "@/stores/walletStore";
import { TNetwork } from "@/types";
import useNotificationStore from "@/stores/notificationStore";

const Dashboard = () => {
  const wallets = useWalletStore((state) => state.wallets);
  const { createWallet } = useWallet();
  const { saveUser } = useStorage();
  const notify = useNotificationStore((state) => state.notify);
  const [addingWallet, setAddingWallet] = useState<TNetwork | boolean>(false);

  const addWallet = async (network: TNetwork) => {
    setAddingWallet(network);
    try {
      await createWallet(network);
      await saveUser();
      setAddingWallet(false);
    } catch (error) {
      notify({
        type: "error",
        message: `Failed to add ${network} wallet. Please try again.`,
      });
      setAddingWallet(true);
    }
  };

  return (
    <div className="w-full max-w-screen-lg relative flex flex-col items-center flex-1 gap-5 py-5">
      <div className="w-full flex flex-col gap-5">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-2xl heading-color">Your Wallets</h2>

          <div className="flex items-center gap-3">
            {addingWallet !== false ? (
              <>
                <Cancel
                  className="size-10 cursor-pointer icon"
                  onClick={() => setAddingWallet(false)}
                />
                <button
                  type="button"
                  onClick={() => addWallet("solana")}
                  className="size-10 bg-zinc-200 dark:bg-zinc-800 p-2.5 rounded-xl"
                >
                  {addingWallet === "solana" ? (
                    <Loader size="sm" />
                  ) : (
                    <Solana />
                  )}
                </button>
                <button type="button" onClick={() => addWallet("ethereum")}>
                  {addingWallet === "ethereum" ? (
                    <Loader size="sm" />
                  ) : (
                    <Ethereum className="size-10 bg-zinc-200 dark:bg-zinc-800 p-2 rounded-xl cursor-pointer" />
                  )}
                </button>
              </>
            ) : (
              <Button
                className="h-10 px-4"
                onClick={() => setAddingWallet(true)}
              >
                Add new wallet
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence>
          <div className="w-full flex flex-col gap-5">
            {Array.from(wallets.values(), (wallet, index) => (
              <motion.div
                key={wallet.address}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                }}
                className="w-full"
              >
                <Wallet
                  {...wallet}
                  name={`Wallet ${index + 1}`}
                  isSingle={wallets.size === 1}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
