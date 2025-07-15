"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { NETWORKS, NETWORK_FUNCTIONS } from "@/config";
import { DEFAULT_NETWORK } from "@/constants";
import type { ReactNode, FormEvent } from "react";
import type { Network, TabContentProps } from "@/types";
import { useAccountsStore, useWalletStore } from "@/stores";
import { fadeUpAnimation, scaleUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import getShortAddress from "@/utils/getShortAddress";
import parseBalance from "@/utils/parseBalance";
import { SendForm, SendSchema } from "@/utils/validations";
import { useBlockchain, useMounted, useAddressQRUpload } from "@/hooks";
import { Check, Cancel, QR } from "@/components/icons";
import { StepProgress } from "@/components/shared";
import {
  Button,
  Input,
  FormError,
  Select,
  Combobox,
  NetworkLogo,
  IconProcessing,
  Tooltip,
} from "@/components/ui";

type SendStep = 1 | 2 | 3 | 4;

type SendStatus = {
  state: "sending" | "success" | "error";
  message: ReactNode;
  signature: string;
};

const getStepProgress = (activeDot: number, backFn?: () => void) => (
  <StepProgress dots={3} activeDot={activeDot} back={backFn} />
);

const SendTab = ({
  initialAnimationDelay,
  showInitialAnimation,
}: TabContentProps) => {
  const networkMode = useWalletStore((state) => state.networkMode);
  const accounts = useAccountsStore((state) => state.accounts);
  const activeAccountIndex = useAccountsStore(
    (state) => state.activeAccountIndex
  );
  const activeAccount = useAccountsStore((state) => state.getActiveAccount());

  const [step, setStep] = useState<SendStep>(1);
  const [network, setNetwork] = useState<Network>(DEFAULT_NETWORK);
  const [sendStatus, setSendStatus] = useState<SendStatus>({
    state: "sending",
    message: "",
    signature: "",
  });

  const networkConfig = NETWORKS[network];
  const networkBalance = parseBalance(activeAccount[network].balance, network);

  const networkOptions = Object.entries(activeAccount).map(
    ([net, { balance }]) => {
      const { name, token } = NETWORKS[net as Network];
      return {
        label: `${name} - ${parseBalance(balance).display} ${token}`,
        value: net as Network,
      };
    }
  );

  const accountOptions = Object.entries(accounts)
    .filter(([key]) => Number(key) !== activeAccountIndex)
    .map(([key, account]) => {
      const address = account[network].address;
      return {
        label: `Account ${Number(key) + 1}`,
        value: address,
        valueIcon: NETWORKS[network].icon,
        shortValue: getShortAddress(address, network),
      };
    });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<SendForm>({
    resolver: zodResolver(SendSchema(network, networkBalance.max)),
    mode: "onChange",
    defaultValues: { toAddress: "", amount: "" },
  });

  const { sendTokensFromActiveAccount, isValidAddress } = useBlockchain();
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

  const handleNetworkChange = (value: Network) => {
    if (value === network) return;
    reset();
    setNetwork(value);
  };

  const handleAmountInput = (e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    let value = target.value.replace(/[^0-9.]/g, "");

    const dotIndex = value.indexOf(".");
    if (dotIndex !== -1) {
      const beforeDot = value.substring(0, dotIndex);
      const afterDot = value.substring(dotIndex + 1).replace(/\./g, "");

      const limitedDecimals = afterDot.substring(0, networkConfig.decimals);
      value = beforeDot + "." + limitedDecimals;
    }

    if (value.startsWith(".")) value = "0" + value;
    target.value = value;
  };

  const handleMaxAmount = () => {
    setValue("amount", networkBalance.max, { shouldValidate: true });
  };

  const handleSend = async () => {
    setStep(3);
    try {
      const { toAddress, amount } = getValues();

      if (toAddress === activeAccount[network].address) {
        setSendStatus({
          state: "error",
          message:
            "It looks like you’re trying to send tokens to your own wallet. We’ve cancelled the transaction to save you from unnecessary network fees.",
          signature: "",
        });
        return;
      }

      const { signature } = await sendTokensFromActiveAccount({
        network,
        toAddress,
        amount,
      });

      setSendStatus({
        state: "success",
        message: (
          <>
            <span className="heading-color">{`${amount} ${networkConfig.token}`}</span>
            <span> has been sent successfully to </span>
            <span className="heading-color">
              {getShortAddress(toAddress, network)}
            </span>
          </>
        ),
        signature,
      });
    } catch {
      setSendStatus({
        state: "error",
        message:
          "This could be due to network congestion or temporary connectivity issues. Please check your transaction details and try again.",
        signature: "",
      });
    } finally {
      setStep(4);
    }
  };

  const hasTabMounted = useMounted(1000);

  const firstStepAnimationProps = hasTabMounted
    ? scaleUpAnimation({ duration: 0.15 })
    : fadeUpAnimation({
        delay: showInitialAnimation ? initialAnimationDelay : undefined,
      });

  return (
    <AnimatePresence mode="wait">
      {step === 1 && (
        <motion.div
          key="send-form-step"
          className="w-full flex flex-col items-center gap-4"
          {...firstStepAnimationProps}
        >
          <Select
            options={networkOptions}
            value={network}
            onChange={handleNetworkChange}
            containerClassName="w-full max-w-lg"
          />

          <form
            onSubmit={handleSubmit(() => setStep(2))}
            className="box max-w-lg sm:p-6 p-5 sm:gap-6 gap-5"
          >
            <NetworkLogo network={network} size="xl" />
            <h2>Send {networkConfig.token}</h2>

            <div className="w-full relative flex items-center gap-2">
              {accountOptions.length > 0 ? (
                <Combobox
                  name="toAddress"
                  control={control}
                  options={accountOptions}
                  placeholder={`Recipient's ${networkConfig.name} address`}
                  autoComplete="off"
                  autoCapitalize="off"
                />
              ) : (
                <Input
                  {...register("toAddress")}
                  placeholder={`Recipient's ${networkConfig.name} address`}
                  autoComplete="off"
                  autoCapitalize="off"
                />
              )}

              <Tooltip content={`Upload ${networkConfig.name} Address QR Code`}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute -z-10 size-0 hidden pointer-events-none opacity-0 overflow-hidden"
                />

                <button
                  type="button"
                  onClick={({ currentTarget }) => {
                    triggerUpload();
                    currentTarget.blur();
                  }}
                  className="flex items-center justify-center size-13 hover:heading-color bg-input border rounded-2xl transition-all duration-200"
                >
                  <QR className="w-6" />
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
                <Tooltip
                  content="Set to Max Transferable Amount"
                  containerClassName="max-w-sm"
                >
                  <button
                    type="button"
                    onClick={handleMaxAmount}
                    className="bg-primary p-2 leading-none heading-color rounded-lg transition-colors duration-200 hover:bg-secondary"
                  >
                    Max
                  </button>
                </Tooltip>
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
          key="confirm-transaction-step"
          className="box max-w-lg gap-0"
          {...scaleUpAnimation({ duration: 0.15 })}
        >
          {getStepProgress(2, () => setStep(1))}

          <div className="p-6 w-full flex flex-col items-center gap-4">
            <h2 className="my-1">Confirm Transaction</h2>

            <div className="w-full bg-primary flex flex-col gap-5 p-5 rounded-2xl">
              {[
                {
                  label: "Amount",
                  value: `${getValues("amount")} ${networkConfig.token}`,
                },
                {
                  label: "To",
                  value: (
                    <Tooltip
                      content={getValues("toAddress")}
                      containerClassName="cursor-default heading-color"
                    >
                      {getShortAddress(getValues("toAddress"), network)}
                    </Tooltip>
                  ),
                },
                {
                  label: "Network",
                  value: `${networkConfig.name}${
                    networkMode === "testnet"
                      ? ` ${networkConfig.testnetName}`
                      : ""
                  }`,
                },
                {
                  label: "Estimated Network Fee",
                  value: `Up to ${networkConfig.fee} ${networkConfig.token}`,
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="w-full flex justify-between items-center leading-none font-medium"
                >
                  <span>{label}</span>
                  {typeof value === "object" ? (
                    value
                  ) : (
                    <span className="heading-color">{value}</span>
                  )}
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
          key="sending-step"
          className="box max-w-lg gap-0"
          {...scaleUpAnimation({ duration: 0.15 })}
        >
          {getStepProgress(3)}

          <div className="p-6 w-full flex flex-col items-center gap-4 text-center">
            <IconProcessing>
              <networkConfig.icon
                className={cn(network === "ethereum" ? "w-7" : "w-8.5")}
              />
            </IconProcessing>
            <h2 className="mt-2">
              Sending<span className="animate-pulse">...</span>
            </h2>
            <div className="flex items-center gap-2.5 heading-color">
              <span>{`${getValues("amount")} ${networkConfig.token} `}</span>
              <span className="font-bold -mt-0.5 text-teal-500">&#8594;</span>
              <span>{getShortAddress(getValues("toAddress"), network)}</span>
            </div>
            <p className="text-sm max-w-sm">
              Processing your transaction. Confirmation usually takes a few
              seconds, depending on blockchain traffic.
            </p>
          </div>
        </motion.div>
      )}

      {step === 4 && (
        <motion.div
          key="send-result-step"
          className="box max-w-lg p-6 pt-10"
          {...scaleUpAnimation({ duration: 0.15 })}
        >
          <div
            className={cn(
              "size-20 rounded-full flex items-center justify-center",
              sendStatus.state === "success"
                ? "bg-teal-500/15 dark:bg-teal-500/10"
                : "bg-rose-500/15 dark:bg-rose-500/10"
            )}
          >
            {sendStatus.state === "success" ? (
              <Check className="w-10 text-teal-500" />
            ) : (
              <Cancel className="w-10 text-rose-500" />
            )}
          </div>

          <h2 className="mt-2">
            {sendStatus.state === "success"
              ? "Transaction Successful"
              : "Transaction Failed"}
          </h2>

          <div>{sendStatus.message}</div>

          {sendStatus.state === "success" && (
            <Link
              href={NETWORK_FUNCTIONS[network].getExplorerUrl(
                "tx",
                networkMode,
                sendStatus.signature
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-teal-500 leading-none border-b border-transparent hover:border-current transition-colors duration-200"
            >
              View Transaction
            </Link>
          )}

          <Button onClick={handleReset} variant="zinc" className="w-full mt-3">
            {sendStatus.state === "success" ? "Done" : "Try Again"}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SendTab;
