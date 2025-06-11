"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NETWORKS } from "@/constants";
import { TNetwork, ITabContentProps } from "@/types";
import { useAccountsStore, useNotificationStore } from "@/stores";
import cn from "@/utils/cn";
import parseBalance from "@/utils/parseBalance";
import { TSendForm, SendSchema } from "@/utils/validations";
import {
  Button,
  Input,
  FormError,
  Select,
  Loader,
  Combobox,
  StepProgress,
} from "../ui";
import getShortAddress from "@/utils/getShortAddress";
import { fadeUpAnimation, scaleUpAnimation } from "@/utils/animations";
import { useMounted } from "@/hooks";

type TSendStep = 1 | 2 | 3;

const getStepProgress = (activeDot: number, backFn?: () => void) => (
  <StepProgress dots={3} activeDot={activeDot} back={backFn} />
);

const SendTab = ({
  initialAnimationDelay,
  showInitialAnimation,
}: ITabContentProps) => {
  const accounts = useAccountsStore((state) => state.accounts);
  const activeAccountIndex = useAccountsStore(
    (state) => state.activeAccountIndex
  );
  const activeAccount = useAccountsStore((state) => state.getActiveAccount)();
  const notify = useNotificationStore((state) => state.notify);

  const [step, setStep] = useState<TSendStep>(1);
  const [network, setNetwork] = useState<TNetwork>("ethereum");
  const {
    name: networkName,
    token: networkToken,
    icon: NetworkIcon,
    decimals: networkDecimals,
  } = NETWORKS[network];

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<TSendForm>({
    resolver: zodResolver(SendSchema(network, activeAccount[network].balance)),
    mode: "onChange",
    defaultValues: { toAddress: "", amount: "" },
  });

  const networkOptions = Object.entries(activeAccount).map(
    ([network, { balance }]) => {
      const { name, token } = NETWORKS[network as TNetwork];
      const { display } = parseBalance(balance);
      return { label: `${name} - ${display} ${token}`, value: network };
    }
  );

  const accountOptions = Object.entries(accounts)
    .filter(([key]) => Number(key) !== activeAccountIndex)
    .map(([key, account]) => ({
      label: `Account ${Number(key) + 1}`,
      value: account[network].address,
      valueIcon: NETWORKS[network].icon,
      shortValue: getShortAddress(account[network].address, network),
    }));

  const handleReset = () => {
    reset();
    setStep(1);
  };

  const hasTabMounted = useMounted();

  return (
    <AnimatePresence mode="wait">
      {step === 1 && (
        <motion.div
          key="send-form"
          className="w-full flex flex-col items-center gap-4"
          {...(showInitialAnimation
            ? fadeUpAnimation({ delay: initialAnimationDelay })
            : scaleUpAnimation(
                hasTabMounted ? { duration: 0.15 } : { withExit: false }
              ))}
        >
          <Select
            options={networkOptions}
            value={network}
            onChange={(value) => {
              setNetwork(value as TNetwork);
              reset();
            }}
            widthClassName="w-full max-w-lg"
          />

          <form
            onSubmit={handleSubmit(() => setStep(2))}
            className="box max-w-lg p-6"
          >
            <div
              className={cn(
                "size-15 bg-zinc-50 dark:bg-zinc-950 rounded-full flex items-center justify-center p-4",
                { "p-4.5": network === "ethereum" }
              )}
            >
              <NetworkIcon />
            </div>

            <h2 className="my-1">Send {networkToken}</h2>

            {Object.keys(accounts).length > 1 ? (
              <Combobox
                name="toAddress"
                control={control}
                placeholder={`Recipient ${network} address`}
                options={accountOptions}
                autoComplete="off"
                autoCapitalize="off"
              />
            ) : (
              <Input
                {...register("toAddress")}
                placeholder={`Recipient's ${network} address`}
                autoComplete="off"
                autoCapitalize="off"
              />
            )}

            <div className="w-full relative flex items-center">
              <Input
                {...register("amount")}
                placeholder="Amount"
                autoComplete="off"
                autoCapitalize="off"
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  let value = target.value;

                  value = value.replace(/[^0-9.]/g, "");

                  const parts = value.split(".");
                  if (parts.length > 2) {
                    value = parts[0] + "." + parts.slice(1).join("");
                  }

                  if (parts[1] && parts[1].length > networkDecimals) {
                    value =
                      parts[0] + "." + parts[1].substring(0, networkDecimals);
                  }

                  if (value.startsWith(".")) {
                    value = "0" + value;
                  }

                  target.value = value;
                }}
              />

              <div className="absolute right-3.5 flex items-center gap-4">
                <span className="text-sm text-gray-500">{networkToken}</span>
                <button
                  type="button"
                  onClick={() => {
                    const { max } = parseBalance(
                      activeAccount[network].balance,
                      network
                    );
                    setValue("amount", max, { shouldValidate: true });
                  }}
                  className="text-sm text-teal-500 hover:text-teal-600 transition-colors"
                >
                  Max
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!isValid}
              className={cn("w-full", {
                "opacity-60 pointer-events-none": !isValid,
              })}
            >
              Next
            </Button>

            <FormError errors={errors} />
          </form>
        </motion.div>
      )}

      {step === 2 && isValid && (
        <motion.div
          key="confirm-transaction"
          className="box max-w-lg gap-0"
          {...scaleUpAnimation({ duration: 0.15 })}
        >
          {getStepProgress(2, () => setStep(1))}
          <div className="p-6 w-full flex flex-col items-center gap-4">
            <h2 className="h3">Confirm Transaction</h2>
            <div className="w-full flex flex-col gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">To:</span>
                <span className="font-mono">
                  {getShortAddress(getValues().toAddress, network)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Amount:
                </span>
                <span>
                  {getValues().amount} {networkToken}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Network:
                </span>
                <span>{networkName}</span>
              </div>
            </div>{" "}
            <div className="w-full flex gap-4">
              <Button onClick={handleReset} variant="zinc" className="w-1/2">
                Cancel
              </Button>
              <Button onClick={() => setStep(3)} className="w-1/2">
                Send
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          key="transaction-success"
          className="box max-w-lg gap-0"
          {...scaleUpAnimation({ duration: 0.15 })}
        >
          {getStepProgress(3)}
          <div className="p-6 w-full flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="h3">Transaction Sent!</h2>
              <p className="text-center text-gray-600 dark:text-gray-400">
                Your transaction has been successfully submitted to the network.
              </p>
            </div>{" "}
            <Button variant="zinc" className="w-full" onClick={handleReset}>
              Close
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SendTab;
