"use client";
import { useTransition } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NETWORKS } from "@/config";
import { FAUCET_PRESET_AMOUNTS } from "@/constants";
import { useNotificationStore, useAccountsStore } from "@/stores";
import { requestSolanaAirdrop } from "@/services/solana";
import { scaleUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import getShortAddress from "@/utils/getShortAddress";
import { SolanaAirdropSchema, SolanaAirdropForm } from "@/utils/validations";
import { Solana } from "@/components/icons";
import {
  Input,
  Combobox,
  PresetSelect,
  Button,
  Loader,
  FormError,
  NetworkLogo,
} from "@/components/ui";

const SolanaFaucetPage = () => {
  const accounts = useAccountsStore((state) => state.accounts);
  const notify = useNotificationStore((state) => state.notify);
  const [airdropping, startAirdropping] = useTransition();

  let accountsOptions = Object.entries(accounts).map(([key, { solana }]) => ({
    label: `Account ${Number(key) + 1}`,
    value: solana.address,
    valueIcon: Solana,
    shortValue: getShortAddress(solana.address, "solana"),
  }));

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<SolanaAirdropForm>({
    resolver: zodResolver(SolanaAirdropSchema),
    mode: "onChange",
  });

  const handleAirdrop = async ({ address, amount }: SolanaAirdropForm) => {
    startAirdropping(async () => {
      try {
        await requestSolanaAirdrop(address, amount);
        notify({
          type: "success",
          message: `Airdrop complete — ${amount} SOL sent to ${getShortAddress(
            address
          )}.`,
        });
        reset();
      } catch {
        notify({
          type: "error",
          message:
            "Airdrop request failed. You may have reached the rate limit (8-hour cooldown) or the faucet may be temporarily unavailable. Try the official Solana faucet if this persists.",
        });
      }
    });
  };

  return (
    <motion.div
      aria-label="Solana Devnet Faucet"
      className="box max-w-lg sm:gap-6 gap-5 sm:p-6 p-5"
      {...scaleUpAnimation()}
    >
      <NetworkLogo network="solana" size="lg" className="mt-2" />
      <h1>Solana Devnet Faucet</h1>
      <p className="-mt-2.5">
        Request free SOL on the Solana Devnet to build, test, and explore. Each
        address can receive up to 5 SOL once every 8 hours. These are test
        tokens with no real-world value. If this doesn't work,&nbsp;
        <Link
          href="https://faucet.solana.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          try the official Solana faucet
        </Link>
        .
      </p>

      <form
        onSubmit={handleSubmit(handleAirdrop)}
        className="w-full flex flex-col sm:gap-4 gap-3"
        aria-label="Solana Airdrop Form"
      >
        <div className="flex items-center sm:gap-2 gap-1.5">
          {accountsOptions.length > 0 ? (
            <Combobox
              name="address"
              control={control}
              options={accountsOptions}
              placeholder="Solana address"
              autoFocus
              autoComplete="off"
              autoCapitalize="off"
            />
          ) : (
            <Input
              {...register("address")}
              placeholder="Solana address"
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
            valueSuffix={NETWORKS.solana.token}
          />
        </div>

        <Button
          type="submit"
          className={cn("w-full mt-0.5", {
            "opacity-60 pointer-events-none": !isValid,
          })}
          disabled={!isValid || airdropping}
        >
          {airdropping ? <Loader size="sm" color="current" /> : "Send Airdrop"}
        </Button>

        <FormError errors={errors} className="mt-2" />
      </form>
    </motion.div>
  );
};

export default SolanaFaucetPage;
