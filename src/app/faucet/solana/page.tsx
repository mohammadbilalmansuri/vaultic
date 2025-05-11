"use client";
import { useTransition } from "react";
import { motion } from "motion/react";
import { Combobox, Input, Button, Loader } from "@/components/ui";
import { useBlockchain } from "@/hooks";
import useNotificationStore from "@/stores/notificationStore";
import useUserStore from "@/stores/userStore";
import useWalletStore from "@/stores/walletStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  solanaAirdropSchema,
  TSolanaAirdropFormData,
} from "@/utils/validations";
import cn from "@/utils/cn";
import { scaleUpAnimation } from "@/utils/animations";
import Link from "next/link";

const SolanaFaucet = () => {
  const userExists = useUserStore((state) => state.userExists);
  const wallets = useWalletStore((state) => state.wallets);
  const notify = useNotificationStore((state) => state.notify);
  const { airdropSolana } = useBlockchain();
  const [airdropping, startAirdropping] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<TSolanaAirdropFormData>({
    resolver: zodResolver(solanaAirdropSchema),
    mode: "onChange",
  });

  const handleAirdrop = async ({ address, amount }: TSolanaAirdropFormData) => {
    startAirdropping(async () => {
      try {
        await airdropSolana(address, amount);
        notify({ type: "success", message: "Airdrop successful!" });
      } catch (err) {
        notify({
          type: "error",
          message: err instanceof Error ? err.message : "Airdrop failed!",
        });
      }
    });
  };

  const renderFormError = () => {
    const errorMessage = errors.address?.message || errors.amount?.message;
    return errorMessage ? (
      <p className="text-yellow-500">{errorMessage}</p>
    ) : null;
  };

  const solanaWalletOptions = Array.from(wallets.values())
    .filter(({ network }) => network === "solana")
    .map(({ index, address }) => ({
      label: `Solana Wallet ${index + 1}`,
      value: address,
    }));

  return (
    <motion.div {...scaleUpAnimation()} className="box max-w-lg">
      <h1 className="box-heading -mt-2">Solana Devnet Faucet</h1>
      <div className="flex flex-col items-center gap-2">
        <p>
          Get free testnet SOL to explore Solana's features and build or test
          applications.
        </p>
        <p>
          Enter your wallet address and the amount (up to 5 SOL). You can
          request SOL once every 24 hours for testing, development, or learning
          purposes.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleAirdrop)}
        className="w-full flex flex-col gap-4 mt-3"
      >
        {userExists && solanaWalletOptions.length > 0 ? (
          <Combobox
            name="address"
            placeholder="Enter or select Solana address"
            control={control}
            options={solanaWalletOptions}
          />
        ) : (
          <Input {...register("address")} placeholder="Enter Solana address" />
        )}

        <Input {...register("amount")} placeholder="Amount (e.g. 1.5)" />

        {renderFormError()}

        <Button
          type="submit"
          className={cn("w-full mt-0.5", {
            "opacity-60 pointer-events-none": !isValid || airdropping,
          })}
          disabled={!isValid || airdropping}
        >
          {airdropping ? <Loader size="sm" color="black" /> : "Request Airdrop"}
        </Button>
      </form>

      <p className="-mb-1 mt-3 flex flex-col gap-2 items-center text-center">
        <span>Having trouble getting SOL?</span>
        <Link
          href="https://faucet.solana.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-all duration-300 border-b border-transparent hover:border-current heading-color leading-tight"
        >
          Try the official Solana faucet
        </Link>
      </p>
    </motion.div>
  );
};

export default SolanaFaucet;
