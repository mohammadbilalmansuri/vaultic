"use client";
import { useTransition } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { SolanaAirdropSchema, TSolanaAirdropForm } from "@/utils/validations";
import { useNotificationStore, useAccountsStore } from "@/stores";
import { useBlockchain } from "@/hooks";
import { FAUCET_PRESET_AMOUNTS, NETWORK_TOKENS } from "@/constants";
import {
  Input,
  Combobox,
  PresetSelect,
  Button,
  Loader,
  FormError,
} from "@/components/ui";
import { scaleUpAnimation } from "@/utils/animations";
import getShortAddress from "@/utils/getShortAddress";
import cn from "@/utils/cn";

const SolanaFaucetPage = () => {
  const accounts = useAccountsStore((state) => state.accounts);
  const notify = useNotificationStore((state) => state.notify);
  const { requestAirdrop } = useBlockchain();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<TSolanaAirdropForm>({
    resolver: zodResolver(SolanaAirdropSchema),
    mode: "onChange",
  });

  const [airdropping, startAirdropping] = useTransition();

  const handleAirdrop = async ({ address, amount }: TSolanaAirdropForm) => {
    startAirdropping(async () => {
      try {
        await requestAirdrop(address, amount);
        notify({
          type: "success",
          message: `Airdrop complete — ${amount} SOL sent to ${getShortAddress(
            address
          )}.`,
        });
        reset();
      } catch (error) {
        notify({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Airdrop failed. Please try again later.",
        });
      }
    });
  };

  return (
    <motion.div {...scaleUpAnimation()} className="box p-12 max-w-xl">
      <h2 className="-mt-1.5">Solana Devnet Faucet</h2>
      <p>
        Request free SOL on the Solana Devnet to build, test, and explore. You
        can request up to 5 SOL in a single airdrop, available once every 8
        hours.
      </p>

      <form
        onSubmit={handleSubmit(handleAirdrop)}
        className="w-full flex flex-col gap-4 mt-3"
      >
        <div className="flex items-center gap-2">
          {Object.keys(accounts).length > 0 ? (
            <Combobox
              name="address"
              control={control}
              placeholder="Enter or select Solana address"
              options={Object.entries(accounts).map(([key, account]) => ({
                label: `Account ${Number(key) + 1}`,
                value: account.solana.address,
              }))}
              autoFocus
              autoComplete="off"
              autoCapitalize="off"
            />
          ) : (
            <Input
              {...register("address")}
              placeholder="Enter Solana address"
              autoFocus
              autoComplete="off"
              autoCapitalize="off"
            />
          )}
          <PresetSelect
            name="amount"
            control={control}
            placeholder="Amount"
            options={FAUCET_PRESET_AMOUNTS}
            valueSuffix={NETWORK_TOKENS.solana}
          />
        </div>
        <Button
          type="submit"
          className={cn("w-full", {
            "opacity-60 pointer-events-none": !isValid,
          })}
          disabled={!isValid || airdropping}
        >
          {airdropping ? <Loader size="sm" color="black" /> : "Send Airdrop"}
        </Button>
        <FormError errors={errors} className="mt-1.5 -mb-2" />
      </form>

      <p className="mt-2 -mb-0.5 flex items-center gap-1.5 leading-snug">
        Can’t get test SOL?{" "}
        <Link
          href="https://faucet.solana.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-transparent hover:border-current heading-color transition-colors duration-300"
        >
          Try the official Solana faucet
        </Link>
      </p>
    </motion.div>
  );
};

export default SolanaFaucetPage;
