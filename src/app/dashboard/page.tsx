"use client";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { Button, Input } from "@/components/common";
import { Solana, Ethereum, Cancel } from "@/components/icons";
import { Wallet } from "@/components/dashboard";
import { useWallet, useStorage } from "@/hooks";
import { useWalletStore } from "@/stores/walletStore";
import { TNetwork } from "@/types";

const Send = () => {
  const wallets = useWalletStore((state) => state.wallets);
  const { createWallet } = useWallet();
  const { saveUser } = useStorage();
  const [isAddingNewWallet, setIsAddingNewWallet] = useState(false);
  const [sendingFrom, setSendingFrom] = useState("");

  const methods = useForm();

  const addWallet = async (network: TNetwork) => {
    try {
      await createWallet(network);
      await saveUser();
      setIsAddingNewWallet(false);
    } catch (error) {
      console.error("Error creating wallet:", error);
    }
  };

  return (
    <>
      <div className="w-full max-w-screen-lg relative flex flex-col items-center flex-1 gap-5 py-5">
        <div className="w-full flex flex-col gap-5">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-2xl heading-color">Your Wallets</h2>

            <div className="flex items-center gap-3">
              {isAddingNewWallet ? (
                <>
                  <Cancel
                    className="size-10 cursor-pointer icon"
                    onClick={() => setIsAddingNewWallet(false)}
                  />
                  <Solana
                    className="size-10 bg-zinc-200 dark:bg-zinc-800 p-2.5 rounded-xl cursor-pointer"
                    onClick={() => addWallet("solana")}
                  />
                  <Ethereum
                    className="size-10 bg-zinc-200 dark:bg-zinc-800 p-2 rounded-xl cursor-pointer"
                    onClick={() => addWallet("ethereum")}
                  />
                </>
              ) : (
                <Button
                  className="h-10 px-4"
                  onClick={() => setIsAddingNewWallet(true)}
                >
                  Add new wallet
                </Button>
              )}
            </div>
          </div>

          <AnimatePresence>
            <div className="w-full flex flex-col gap-5">
              {wallets.map((wallet, index) => (
                <motion.div
                  key={wallet.address}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                  }}
                  className="w-full"
                >
                  <Wallet
                    {...wallet}
                    name={`Wallet ${index + 1}`}
                    isSingle={wallets.length === 1}
                    setSendingFrom={setSendingFrom}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      </div>

      {sendingFrom && (
        <div className="size-full absolute flex flex-col items-center justify-center flex-1 gap-5 bg-zinc-200/60 dark:bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-5">
          <div className="w-full max-w-xl relative flex flex-col gap-5 py-5">
            <h2 className="text-2xl heading-color">Send</h2>
            <p>Sending from {sendingFrom}</p>

            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit((data) => console.log(data))}
                className="w-full flex flex-col gap-5"
              >
                <Input placeholder="Enter address" />
                <Input placeholder="Enter amount" />
                <Button type="submit">Send</Button>
                <Button
                  variant="zinc"
                  type="button"
                  onClick={() => setSendingFrom("")}
                >
                  cancle
                </Button>
              </form>
            </FormProvider>
          </div>
        </div>
      )}
    </>
  );
};

export default Send;
