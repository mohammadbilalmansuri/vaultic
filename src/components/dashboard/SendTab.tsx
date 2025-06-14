"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BigNumber from "bignumber.js";
import Link from "next/link";
import { NETWORKS } from "@/constants";
import { TNetwork, ITabContentProps } from "@/types";
import { useAccountsStore, useActivityStore, useWalletStore } from "@/stores";
import { fadeUpAnimation, scaleUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import getShortAddress from "@/utils/getShortAddress";
import delay from "@/utils/delay";
import parseBalance from "@/utils/parseBalance";
import { TSendForm, SendSchema } from "@/utils/validations";
import { useBlockchain, useMounted, useAddressQRUpload } from "@/hooks";
import {
  Button,
  Input,
  FormError,
  Select,
  Combobox,
  StepProgress,
  NetworkLogo,
  IconProcessing,
  Tooltip,
} from "../ui";
import { Check, Cancel, Upload } from "../ui/icons";

type TSendStep = 1 | 2 | 3 | 4;

type TSendStatus = {
  state: "sending" | "success" | "error";
  message: string;
  signature: string;
};

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
  const [sendStatus, setSendStatus] = useState<TSendStatus>({
    state: "sending",
    message: "",
    signature: "",
  });

  const networkConfig = NETWORKS[network];
  const networkMaxBalance = parseBalance(
    activeAccount[network].balance,
    network
  ).max;

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

  const { sendTransaction, isValidAddress } = useBlockchain();
  const { fileInputRef, triggerUpload, handleFileChange } = useAddressQRUpload({
    network,
    onAddressScanned: (address) =>
      setValue("toAddress", address, { shouldValidate: true }),
    validateAddress: isValidAddress,
  });

  const handleReset = () => {
    reset();
    setStep(1);
    setSendStatus({ state: "sending", message: "", signature: "" });
  };

  const handleNetworkChange = (value: TNetwork) => {
    reset();
    setNetwork(value);
  };

  const handleAmountInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    let value = target.value.replace(/[^0-9.]/g, "");

    const parts = value.split(".");
    if (parts.length > 2) value = parts[0] + "." + parts.slice(1).join("");
    if (parts[1]?.length > networkConfig.decimals)
      value = parts[0] + "." + parts[1].slice(0, networkConfig.decimals);
    if (value.startsWith(".")) value = "0" + value;

    target.value = value;
  };

  const handleMaxAmount = () => {
    setValue("amount", networkMaxBalance, {
      shouldValidate: true,
    });
  };

  const handleSend = async () => {
    setStep(3);
    try {
      const { toAddress, amount } = getValues();
      if (toAddress === activeAccount[network].address) {
        throw new Error(
          "You cannot send funds to your own address. Please enter a different recipient."
        );
      }
      const signature = await sendTransaction({
        network,
        fromPrivateKey: activeAccount[network].privateKey,
        toAddress,
        amount,
      });
      addActivity({
        signature,
        from: activeAccount[network].address,
        to: toAddress,
        amount,
        timestamp: Date.now(),
        network,
        status: "success",
        type: "send",
      });
      updateActiveAccount({
        ...activeAccount,
        [network]: {
          ...activeAccount[network],
          balance: new BigNumber(activeAccount[network].balance)
            .minus(new BigNumber(amount))
            .toString(),
        },
      });
      setSendStatus({
        state: "success",
        message: "Transaction sent successfully!",
        signature,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Transaction failed. Please try again.";

      setSendStatus({
        state: "error",
        message: errorMessage,
        signature: "",
      });
    } finally {
      await delay(1000);
      setStep(4);
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
            onChange={handleNetworkChange}
            widthClassName="w-full max-w-lg"
          />

          <form
            onSubmit={handleSubmit(() => setStep(2))}
            className="box max-w-lg p-6"
          >
            <NetworkLogo network={network} size="xl" />
            <h2 className="my-1">Send {networkConfig.token}</h2>

            <div className="w-full relative flex items-center gap-2">
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

              <Tooltip content="Upload Address QR">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute -z-10 size-0 hidden pointer-events-none invisible opacity-0 overflow-hidden"
                />

                <button
                  type="button"
                  onClick={triggerUpload}
                  className="flex items-center justify-center size-13 transition-all duration-300 hover:heading-color bg-input border border-color hover:border-focus rounded-2xl"
                >
                  <Upload className="w-5.5" />
                </button>
              </Tooltip>
            </div>

            <div className="w-full relative flex items-center">
              <Input
                {...register("amount")}
                placeholder="Amount"
                autoComplete="off"
                autoCapitalize="off"
                onInput={handleAmountInput}
              />

              <div className="absolute right-2.5 flex items-center gap-3">
                <span className="font-medium">{networkConfig.token}</span>
                <button
                  type="button"
                  onClick={handleMaxAmount}
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
          key="confirm-send"
          className="box max-w-lg gap-0"
          {...scaleUpAnimation({ duration: 0.15 })}
        >
          {getStepProgress(2, () => setStep(1))}

          <div className="p-6 w-full flex flex-col items-center gap-4">
            <h2 className="my-1">Confirm Send</h2>

            <div className="w-full flex flex-col gap-0.5">
              {[
                {
                  label: "Amount",
                  value: `${getValues("amount")} ${networkConfig.token}`,
                },
                {
                  label: "To",
                  value: getShortAddress(getValues("toAddress"), network),
                },
                {
                  label: "Network",
                  value: `${networkConfig.name}${
                    networkMode === "testnet"
                      ? ` • ${NETWORKS[network].testnetName}`
                      : ""
                  }`,
                },
                {
                  label: "Network Fee",
                  value: `${networkConfig.fee} ${networkConfig.token}`,
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
          key="sending"
          className="box max-w-lg gap-0"
          {...scaleUpAnimation({ duration: 0.15 })}
        >
          {getStepProgress(3)}

          <div className="p-6 w-full flex flex-col items-center gap-6 text-center">
            <IconProcessing>
              <networkConfig.icon
                className={cn(network === "ethereum" ? "w-7" : "w-8.5")}
              />
            </IconProcessing>
            <h2>Sending</h2>
            <p className="-mt-2">
              {getValues("amount")} {networkConfig.token}&nbsp;to&nbsp;
              {getShortAddress(getValues("toAddress"), network)}
            </p>
          </div>
        </motion.div>
      )}

      {step === 4 && (
        <motion.div
          key="send-result"
          className="box max-w-lg p-6 pt-12"
          {...scaleUpAnimation({ duration: 0.15 })}
        >
          <div
            className={cn(
              "size-20 rounded-full flex items-center justify-center",
              {
                "bg-teal-500/15 dark:bg-teal-500/10":
                  sendStatus.state === "success",
                "bg-rose-500/15 dark:bg-rose-500/10":
                  sendStatus.state === "error",
              }
            )}
          >
            {sendStatus.state === "success" ? (
              <Check className="w-10 text-teal-500" />
            ) : (
              <Cancel className="w-10 text-rose-500" />
            )}
          </div>

          <h2 className="mt-3 leading-none">
            {sendStatus.state === "success" ? "Sent!" : "Transaction Failed"}
          </h2>

          <p>
            {sendStatus.state === "success"
              ? `${getValues("amount")} ${
                  networkConfig.token
                } was successfully sent
        to ${getShortAddress(getValues("toAddress"), network)}`
              : sendStatus.message}
          </p>

          {sendStatus.state === "success" && (
            <Link
              href={networkConfig.explorerUrl(
                "tx",
                networkMode,
                sendStatus.signature
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-500 leading-none border-b border-transparent hover:border-current transition-colors duration-300"
            >
              View Transaction
            </Link>
          )}

          <Button onClick={handleReset} variant="zinc" className="w-full mt-4">
            {sendStatus.state === "success" ? "Done" : "Try Again"}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SendTab;
