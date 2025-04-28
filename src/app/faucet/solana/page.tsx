"use client";
import { use, useTransition } from "react";
import { motion } from "motion/react";
import { Button, Input, Loader, CustomInputSelect } from "@/components/ui";
import { useBlockchain } from "@/hooks";
import useNotificationStore from "@/stores/notificationStore";
import useUserStore from "@/stores/userStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  solanaAirdropSchema,
  TSolanaAirdropFormData,
} from "@/utils/validations";

import cn from "@/utils/cn";
import useWalletStore from "@/stores/walletStore";

const SolanaFaucet = () => {
  const userExists = useUserStore((state) => state.userExists);
  const wallets = useWalletStore((state) => state.wallets);
  const notify = useNotificationStore((state) => state.notify);

  const { airdropSolana } = useBlockchain();
  const [airdroping, startAirdroping] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<TSolanaAirdropFormData>({
    resolver: zodResolver(solanaAirdropSchema),
    mode: "onChange",
  });

  const handleAirdrop = async ({
    address,
    amount,
  }: {
    address: string;
    amount: string;
  }) => {
    startAirdroping(async () => {
      try {
        await airdropSolana(address, amount);
        notify({
          type: "success",
          message: "Airdrop successful!",
        });
      } catch (error) {
        const err = error as Error;

        if (
          err.message.includes("limit") ||
          err.message.includes("rate limit")
        ) {
          notify({
            type: "error",
            message: "Airdrop limit reached. Please try after 24 hours.",
          });
        } else {
          notify({
            type: "error",
            message: "Airdrop failed. Please try again.",
          });
        }
      }
    });
  };

  const renderFormError = () => {
    const errorMessage = errors.address?.message || errors.amount?.message;

    return errorMessage ? (
      <p className="text-yellow-500">{errorMessage}</p>
    ) : null;
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="box max-w-lg"
    >
      <h1 className="-mt-1">Solana Devnet Faucet</h1>
      <p className="max-w-sm">
        Request SOL tokens for the Solana Devnet. Enter your wallet address and
        the amount of SOL you want to receive. The maximum amount is 5 SOL and
        youo can request it once every 24 hours.
      </p>

      <form
        onSubmit={handleSubmit(handleAirdrop)}
        className="w-full flex flex-col gap-4 pt-2"
      >
        {userExists ? (
          <CustomInputSelect
            name="address"
            control={control}
            options={Array.from(wallets.values())
              .filter((wallet) => wallet.network === "solana")
              .map((wallet) => ({
                label: `Solana Wallet ${wallet.index + 1}`,
                value: wallet.address,
              }))}
          />
        ) : (
          <Input {...register("address")} placeholder="Enter solana address" />
        )}
        <Input {...register("amount")} placeholder="Enter amount" />
        {renderFormError()}
        <Button
          type="submit"
          className={cn("w-full", {
            "opacity-60 pointer-events-none": !isValid,
          })}
          disabled={!isValid}
        >
          {airdroping ? <Loader size="sm" color="black" /> : "Next"}
        </Button>
      </form>
    </motion.div>
  );
};

export default SolanaFaucet;
