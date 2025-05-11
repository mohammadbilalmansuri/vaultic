"use client";
import { useTransition } from "react";
import { motion } from "motion/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Combobox, Input, Button, Loader } from "@/components/ui";
import useUserStore from "@/stores/userStore";
import useNotificationStore from "@/stores/notificationStore";
import useWalletStore from "@/stores/walletStore";
import { useBlockchain } from "@/hooks";
import { FAUCET_PRESET_AMOUNTS } from "@/constants";
import {
  solanaAirdropSchema,
  TSolanaAirdropFormData,
} from "@/utils/validations";
import { scaleUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import getShortAddress from "@/utils/getShortAddress";

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
    reset,
    formState: { errors, isValid },
  } = useForm<TSolanaAirdropFormData>({
    resolver: zodResolver(solanaAirdropSchema),
    mode: "onChange",
  });

  const handleAirdrop = async ({ address, amount }: TSolanaAirdropFormData) => {
    startAirdropping(async () => {
      try {
        await airdropSolana(address, amount);
        notify({
          type: "success",
          message: `Airdrop successful! ${amount} SOL sent to ${getShortAddress(
            address
          )}.`,
        });
        reset();
      } catch (err) {
        notify({
          type: "error",
          message:
            err instanceof Error
              ? err.message
              : "An unexpected error occurred.",
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
      <p>
        Request free devnet SOL to build, test, or explore the Solana network.
        Select or enter your wallet address and choose an airdrop amount. You
        can request up to 5 SOL once every 8 hours.
      </p>

      <form
        onSubmit={handleSubmit(handleAirdrop)}
        className="w-full flex flex-col gap-4 mt-3"
      >
        {userExists && solanaWalletOptions.length > 0 ? (
          <Combobox
            name="address"
            placeholder="Solana wallet address"
            control={control}
            options={solanaWalletOptions}
          />
        ) : (
          <Input {...register("address")} placeholder="Solana wallet address" />
        )}

        <Controller
          name="amount"
          control={control}
          rules={{ required: "Please select an amount" }}
          render={({ field: { onChange, value } }) => (
            <div className="grid grid-cols-4 gap-3">
              {FAUCET_PRESET_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => onChange(value === amt ? "" : amt)}
                  className={cn(
                    "bg-primary heading-color py-2 px-3 rounded-xl hover:bg-secondary transition-colors duration-300 border-1.5",
                    {
                      "border-zinc-300 dark:border-zinc-700": value === amt,
                      "border-transparent": value !== amt,
                    }
                  )}
                >
                  {amt} SOL
                </button>
              ))}
            </div>
          )}
        />

        {renderFormError()}

        <Button
          type="submit"
          className={cn("w-full mt-0.5", {
            "opacity-60 pointer-events-none": !isValid,
          })}
          disabled={!isValid || airdropping}
        >
          {airdropping ? <Loader size="sm" color="black" /> : "Request Airdrop"}
        </Button>
      </form>

      <p className="-mb-0.5 mt-3 leading-tight">
        Can't get test SOL?{" "}
        <Link
          href="https://faucet.solana.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-all duration-300 border-b border-transparent hover:border-current heading-color"
        >
          Try the official Solana faucet
        </Link>
      </p>
    </motion.div>
  );
};

export default SolanaFaucet;
