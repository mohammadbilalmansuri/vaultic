"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BigNumber from "bignumber.js";
import Link from "next/link";
import { NETWORKS } from "@/constants";
import { TNetwork, ITabContentProps, IActivity } from "@/types";
import { useAccountsStore, useActivityStore, useWalletStore } from "@/stores";
import { fadeUpAnimation, scaleUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import getShortAddress from "@/utils/getShortAddress";
import parseBalance from "@/utils/parseBalance";
import { TSendForm, SendSchema } from "@/utils/validations";
import { useBlockchain, useMounted } from "@/hooks";
import {
  Button,
  Input,
  FormError,
  Select,
  Combobox,
  StepProgress,
  NetworkLogo,
  IconProcessing,
} from "../ui";
import { Check, Cancel } from "../ui/icons";

type TSendStep = 1 | 2 | 3;

const getStepProgress = (activeDot: number, backFn?: () => void) => (
  <StepProgress dots={3} activeDot={activeDot} back={backFn} />
);

const SendTab = ({
  initialAnimationDelay,
  showInitialAnimation,
}: ITabContentProps) => {
  const networkMode = useWalletStore((state) => state.networkMode);
  const accounts = useAccountsStore((state) => state.accounts);
  const activeAccountIndex = useAccountsStore(
    (state) => state.activeAccountIndex
  );
  const activeAccount = useAccountsStore((state) => state.getActiveAccount)();
  const addActivity = useActivityStore((state) => state.addActivity);
  const updateActiveAccount = useAccountsStore(
    (state) => state.updateActiveAccount
  );

  const [step, setStep] = useState<TSendStep>(1);
  const [network, setNetwork] = useState<TNetwork>("ethereum");

  const {
    name: networkName,
    token: networkToken,
    decimals: networkDecimals,
    fee: networkFee,
    icon: NetworkIcon,
    explorerUrl: getNetworkExplorerUrl,
  } = NETWORKS[network];
  const { max: networkMaxBalance } = parseBalance(
    activeAccount[network].balance,
    network
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<TSendForm>({
    resolver: zodResolver(SendSchema(network, networkMaxBalance)),
    mode: "onChange",
    defaultValues: { toAddress: "", amount: "" },
  });

  const networkOptions = Object.entries(activeAccount).map(
    ([net, { balance }]) => {
      const { name, token } = NETWORKS[net as TNetwork];
      return {
        label: `${name} - ${parseBalance(balance).display} ${token}`,
        value: net as TNetwork,
      };
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
    setTxStatus({ state: "sending" });
  };

  const { sendTransaction } = useBlockchain();
  const [txStatus, setTxStatus] = useState<{
    state: "sending" | "success" | "error";
    message?: string;
    signature?: string;
  }>({ state: "sending" });

  const handleSend = async () => {
    setStep(3);
    try {
      const { toAddress, amount } = getValues();
      const signature = await sendTransaction({
        network,
        fromPrivateKey: activeAccount[network].privateKey,
        toAddress,
        amount,
      });
      const newActivity: IActivity = {
        signature,
        from: activeAccount[network].address,
        to: toAddress,
        amount,
        timestamp: Date.now(),
        network,
        status: "success",
        type: "send",
      };
      setTxStatus({
        state: "success",
        message: "Transaction sent successfully!",
        signature,
      });
      addActivity(newActivity);
      const balanceNow = new BigNumber(activeAccount[network].balance).minus(
        new BigNumber(amount)
      );
      updateActiveAccount({
        ...activeAccount,
        [network]: {
          ...activeAccount[network],
          balance: balanceNow.toString(),
        },
      });
    } catch {
      setTxStatus({
        state: "error",
        message: "Transaction failed. Please try again.",
      });
    }
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
              reset();
              setNetwork(value);
            }}
            widthClassName="w-full max-w-lg"
          />

          <form
            onSubmit={handleSubmit(() => setStep(2))}
            className="box max-w-lg p-6"
          >
            <NetworkLogo network={network} size="xl" />
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
                  let value = target.value.replace(/[^0-9.]/g, "");

                  const parts = value.split(".");
                  if (parts.length > 2)
                    value = parts[0] + "." + parts.slice(1).join("");
                  if (parts[1]?.length > networkDecimals)
                    value = parts[0] + "." + parts[1].slice(0, networkDecimals);
                  if (value.startsWith(".")) value = "0" + value;

                  target.value = value;
                }}
              />

              <div className="absolute right-2.5 flex items-center gap-3">
                <span className="font-medium">{networkToken}</span>
                <button
                  type="button"
                  onClick={() =>
                    setValue("amount", networkMaxBalance, {
                      shouldValidate: true,
                    })
                  }
                  className="bg-primary p-2 leading-none heading-color rounded-lg transition-colors duration-300 hover:bg-secondary"
                >
                  Max
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!isValid}
              className={cn("w-full mt-0.5", {
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
            <h2 className="my-1">Confirm Transaction</h2>

            <div className="w-full flex flex-col gap-0.5">
              {[
                {
                  label: "Amount",
                  value: `${getValues("amount")} ${networkToken}`,
                },
                {
                  label: "To",
                  value: getShortAddress(getValues("toAddress"), network),
                },
                {
                  label: "Network",
                  value: `${networkName}${
                    networkMode === "testnet"
                      ? ` • ${NETWORKS[network].testnetName}`
                      : ""
                  }`,
                },
                {
                  label: "Network Fee",
                  value: `${networkFee} ${networkToken}`,
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="w-full flex justify-between items-center bg-primary p-4 leading-none rounded-xl"
                >
                  <span className="font-medium">{label}</span>
                  <span className="heading-color font-medium">{value}</span>
                </div>
              ))}
            </div>

            <div className="w-full flex gap-4 mt-0.5">
              <Button onClick={handleReset} variant="zinc" className="w-1/2">
                Cancel
              </Button>
              <Button onClick={handleSend} className="w-1/2">
                Send
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          key="transaction-status"
          className="box max-w-lg gap-0"
          {...scaleUpAnimation({ duration: 0.15 })}
        >
          {getStepProgress(3)}

          {txStatus.state === "sending" && (
            <div className="p-6 w-full flex flex-col items-center gap-6 text-center">
              <IconProcessing>
                <NetworkIcon
                  className={cn(network === "ethereum" ? "w-7" : "w-8.5")}
                />
              </IconProcessing>
              <h2>Sending</h2>
              <p className="-mt-2">
                {getValues("amount")} {networkToken}&nbsp;to&nbsp;
                {getShortAddress(getValues("toAddress"), network)}
              </p>
            </div>
          )}

          {txStatus.state === "success" && (
            <div className="p-6 w-full flex flex-col items-center gap-4 text-center">
              <div className="size-20 rounded-full flex items-center justify-center bg-teal-500/15 dark:bg-teal-500/10">
                <Check className="w-10 text-teal-500" />
              </div>
              <h2 className="mt-3 leading-none">Sent!</h2>
              <p>
                {getValues("amount")} {networkToken}&nbsp;was successfully sent
                to&nbsp;{getShortAddress(getValues("toAddress"), network)}
              </p>
              <Link
                href={getNetworkExplorerUrl(
                  "tx",
                  networkMode,
                  txStatus.signature!
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-500 leading-none border-b border-transparent hover:border-current transition-colors duration-300"
              >
                View Transaction
              </Link>
              <Button
                onClick={handleReset}
                variant="zinc"
                className="w-full mt-4"
              >
                Close
              </Button>
            </div>
          )}
          {txStatus.state === "error" && (
            <div className="p-6 w-full flex flex-col items-center gap-4 text-center">
              <div className="size-20 rounded-full flex items-center justify-center bg-rose-500/15 dark:bg-rose-500/10">
                <Cancel className="w-10 text-rose-500" />
              </div>
              <h2 className="mt-3 leading-none">Transaction Failed</h2>
              <p>{txStatus.message}</p>
              <Button
                onClick={handleReset}
                variant="zinc"
                className="w-full mt-4"
              >
                Close
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SendTab;
