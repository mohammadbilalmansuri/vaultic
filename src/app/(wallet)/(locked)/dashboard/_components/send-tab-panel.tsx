"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { NETWORKS, NETWORK_FUNCTIONS } from "@/config";
import { DEFAULT_NETWORK } from "@/constants";
import type { ReactNode, FormEvent } from "react";
import type { Network, TabPanelProps } from "@/types";
import {
  useAccounts,
  useActiveAccount,
  useActiveAccountIndex,
  useNetworkMode,
} from "@/stores";
import { fadeUpAnimation, scaleUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import getShortAddress from "@/utils/get-short-address";
import parseBalance from "@/utils/parse-balance";
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

const SendTabPanel = ({
  initialAnimationDelay,
  showInitialAnimation,
}: TabPanelProps) => {
  const networkMode = useNetworkMode();
  const accounts = useAccounts();
  const activeAccountIndex = useActiveAccountIndex();
  const activeAccount = useActiveAccount();

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
    ([key, { balance }]) => {
      const value = key as Network;
      const { name, token } = NETWORKS[value];
      const displayBalance = parseBalance(balance, value).display;

      return { label: `${name} - ${displayBalance} ${token}`, value };
    }
  );

  const accountOptions = Object.entries(accounts)
    .filter(([key]) => Number(key) !== activeAccountIndex)
    .map(([key, account]) => {
      const { address } = account[network];
      return {
        label: `Account ${Number(key) + 1}`,
        value: address,
        valueIcon: NETWORKS[network].icon,
        shortValue: getShortAddress(address, network),
      };
    });

  const { sendTokensFromActiveAccount, isValidAddress } = useBlockchain();

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
            <span className="text-primary">{`${amount} ${networkConfig.token}`}</span>
            <span> has been sent successfully to </span>
            <span className="text-primary">
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
          className="w-full max-w-lg flex flex-col items-center md:gap-3 gap-2.5"
          {...firstStepAnimationProps}
          aria-label="Send tokens form"
          role="region"
        >
          <Select
            options={networkOptions}
            value={network}
            onChange={handleNetworkChange}
          />

          <div className="box max-w-full sm:p-6 p-5 sm:gap-6 gap-5">
            <NetworkLogo network={network} size="lg" className="mt-2" />
            <h2>Send {networkConfig.token}</h2>

            <form
              onSubmit={handleSubmit(() => setStep(2))}
              className="w-full flex flex-col sm:gap-4 gap-3"
            >
              <div className="w-full relative flex items-center sm:gap-2 gap-1.5">
                {accountOptions.length > 0 ? (
                  <Combobox
                    name="toAddress"
                    control={control}
                    options={accountOptions}
                    placeholder={`Recipient's ${networkConfig.name} address`}
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                ) : (
                  <Input
                    {...register("toAddress")}
                    placeholder={`Recipient's ${networkConfig.name} address`}
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                )}

                <Tooltip content="Upload QR Code" position="left">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute -z-10 size-0 hidden pointer-events-none opacity-0 overflow-hidden"
                  />

                  <button
                    type="button"
                    className="flex items-center justify-center sm:size-13 size-12 p-3 hover:text-primary bg-input border rounded-2xl transition-colors duration-200"
                    onClick={triggerUpload}
                    aria-label="Upload QR code to scan recipient address"
                  >
                    <QR className="sm:w-6 w-5.5" />
                  </button>
                </Tooltip>
              </div>

              <div className="w-full relative flex items-center">
                <Input
                  {...register("amount")}
                  placeholder="Amount"
                  autoComplete="off"
                  autoCapitalize="off"
                  inputMode="decimal"
                  spellCheck="false"
                  onInput={handleAmountInput}
                  className="sm:pr-28 pr-26"
                />

                <div className="absolute sm:right-2.5 right-2 flex items-center sm:gap-3 gap-2.5">
                  <span className="font-medium">{networkConfig.token}</span>
                  <Tooltip
                    content="Set Max Amount"
                    position="left"
                    containerClassName="max-w-sm"
                  >
                    <button
                      type="button"
                      onClick={handleMaxAmount}
                      className="bg-primary p-2 text-sm uppercase leading-none text-primary rounded-lg transition-colors duration-200 hover:bg-secondary"
                      aria-label="Set maximum amount"
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
                aria-label="Proceed to transaction confirmation"
              >
                Next
              </Button>
              <FormError errors={errors} />
            </form>
          </div>
        </motion.div>
      )}

      {step === 2 && isValid && (
        <motion.div
          key="confirm-transaction-step"
          className="box max-w-lg"
          {...scaleUpAnimation({ duration: 0.15 })}
          aria-label="Transaction confirmation"
          role="region"
        >
          {getStepProgress(2, () => setStep(1))}

          <div className="w-full flex flex-col items-center sm:gap-4 gap-3 sm:p-6 p-5">
            <h2>Confirm Transaction</h2>

            <div className="w-full bg-primary flex flex-col gap-5 sm:p-5 p-4 rounded-2xl mt-1">
              {[
                {
                  label: "Amount",
                  value: (
                    <>
                      {getValues("amount")} {networkConfig.token}
                    </>
                  ),
                },
                {
                  label: "To",
                  value: (
                    <Tooltip
                      content={getValues("toAddress")}
                      position="left"
                      delay={0}
                      tooltipClassName="xs:w-auto w-40 xs:whitespace-nowrap whitespace-break-spaces xs:break-normal break-all"
                    >
                      <span>
                        {getShortAddress(getValues("toAddress"), network)}
                      </span>
                    </Tooltip>
                  ),
                },
                {
                  label: "Network",
                  value: (
                    <>
                      {networkConfig.name}
                      {networkMode === "testnet" &&
                        ` ${networkConfig.testnetName}`}
                    </>
                  ),
                },
                {
                  label: "Network Fee",
                  value: (
                    <>
                      Up to {networkConfig.fee} {networkConfig.token}
                    </>
                  ),
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="w-full flex items-center justify-between text-left gap-2 flex-wrap leading-none xs:text-base text-15"
                >
                  <h5>{label}</h5>
                  <div className="text-primary">{value}</div>
                </div>
              ))}
            </div>

            <div className="w-full flex items-center sm:gap-4 gap-3 mt-0.5">
              <Button
                onClick={handleReset}
                variant="zinc"
                className="flex-1"
                aria-label="Cancel transaction and return to form"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                className="flex-1"
                aria-label="Confirm and send transaction"
              >
                Send
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          key="sending-step"
          className="box max-w-lg"
          {...scaleUpAnimation({ duration: 0.15 })}
          aria-label="Transaction in progress"
          aria-live="polite"
          role="status"
        >
          {getStepProgress(3)}

          <div className="w-full flex flex-col items-center xs:gap-4 gap-3 xs:p-8 p-6">
            <IconProcessing>
              <networkConfig.icon
                className={cn(
                  network === "ethereum" ? "xs:w-6.5 w-6" : "xs:w-8 w-7"
                )}
              />
            </IconProcessing>
            <h2 className="mt-2">
              Sending
              <span className="animate-pulse" aria-hidden="true">
                ...
              </span>
            </h2>
            <div className="flex items-center justify-center gap-x-2.5 flex-wrap text-primary">
              <span>{`${getValues("amount")} ${networkConfig.token} `}</span>
              <span
                className="font-bold -mt-0.5 text-teal-500"
                aria-hidden="true"
              >
                &#8594;
              </span>
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
          className="box max-w-lg sm:gap-6 gap-5 sm:p-6 p-5"
          {...scaleUpAnimation({ duration: 0.15 })}
          aria-label="Transaction result"
          role="region"
        >
          <div
            className={cn(
              "sm:size-14 size-12 sm:rounded-2xl rounded-xl flex items-center justify-center border mt-2",
              sendStatus.state === "success"
                ? "highlight-teal"
                : "highlight-rose"
            )}
            role="img"
            aria-label={`Transaction ${
              sendStatus.state === "success" ? "successful" : "failed"
            }`}
          >
            {sendStatus.state === "success" ? (
              <Check className="sm:w-9 w-8" aria-hidden="true" />
            ) : (
              <Cancel className="sm:w-9 w-8" aria-hidden="true" />
            )}
          </div>

          <h2>
            {sendStatus.state === "success"
              ? "Transaction Successful"
              : "Transaction Failed"}
          </h2>

          <div className="-mt-2.5" role="status">
            {sendStatus.message}
          </div>

          {sendStatus.state === "success" && (
            <Link
              href={NETWORK_FUNCTIONS[network].getExplorerUrl(
                "tx",
                networkMode,
                sendStatus.signature
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="link text-teal-500 -mt-1"
              aria-label="View transaction details on blockchain explorer (opens in new tab)"
            >
              View Transaction
            </Link>
          )}

          <Button
            onClick={handleReset}
            variant="zinc"
            className="w-full mt-0.5"
            aria-label={
              sendStatus.state === "success"
                ? "Return to Send Form"
                : "Try sending transaction again"
            }
          >
            {sendStatus.state === "success" ? "Done" : "Try Again"}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SendTabPanel;
