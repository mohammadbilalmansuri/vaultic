"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NETWORKS } from "@/constants";
import { TNetwork, ITabContentProps } from "@/types";
import {
  useAccountsStore,
  useNotificationStore,
  useWalletStore,
} from "@/stores";
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
  NetworkLogo,
} from "../ui";
import getShortAddress from "@/utils/getShortAddress";
import { fadeUpAnimation, scaleUpAnimation } from "@/utils/animations";
import { useMounted } from "@/hooks";
import { Ethereum, Solana } from "../ui/icons";

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
  const notify = useNotificationStore((state) => state.notify);

  const [step, setStep] = useState<TSendStep>(3);
  const [network, setNetwork] = useState<TNetwork>("ethereum");
  const {
    name: networkName,
    token: networkToken,
    decimals: networkDecimals,
    fee: networkFee,
    icon: NetworkIcon,
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
    defaultValues: {
      toAddress: "0xE9D74275a70C0c03082B3BbA0FB01EeDe2FcEa83",
      amount: "0.00001",
    },
  });

  const networkOptions = Object.entries(activeAccount).map(
    ([network, { balance }]) => {
      const { name, token } = NETWORKS[network as TNetwork];
      const { display } = parseBalance(balance);
      return {
        label: `${name} - ${display} ${token}`,
        value: network as TNetwork,
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

              <div className="absolute right-2.5 flex items-center gap-3">
                <span className="font-medium">{networkToken}</span>

                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      "amount",
                      parseBalance(activeAccount[network].balance, network).max,
                      { shouldValidate: true }
                    )
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
                    networkMode === "devnet"
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
              <Button onClick={() => setStep(3)} className="w-1/2">
                Send
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {step === 3 && isValid && (
        <motion.div
          key="transaction-success"
          className="box max-w-lg gap-0"
          {...scaleUpAnimation({ duration: 0.15 })}
        >
          {getStepProgress(3)}

          <div className="p-6 w-full flex flex-col items-center gap-6">
            <div className="relative flex items-center justify-center">
              <NetworkIcon
                className={cn(
                  "absolute",
                  network === "ethereum" ? "w-7" : "w-8.5"
                )}
              />
              <Loader size="xl" />
            </div>

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
