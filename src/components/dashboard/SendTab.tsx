"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NETWORKS } from "@/constants";
import { TNetwork } from "@/types";
import { useAccountsStore, useNotificationStore } from "@/stores";
import cn from "@/utils/cn";
import parseBalance from "@/utils/parseBalance";
import {
  TSendTransactionForm,
  SendTransactionSchema,
} from "@/utils/validations";
import { Button, Input, FormError, Select, Loader, Combobox } from "../ui";
import getShortAddress from "@/utils/getShortAddress";

const SendTab = () => {
  const [step, setStep] = useState(1);
  const [network, setNetwork] = useState<TNetwork>("ethereum");

  const accounts = useAccountsStore((state) => state.accounts);
  const activeAccountIndex = useAccountsStore(
    (state) => state.activeAccountIndex
  );
  const activeAccount = useAccountsStore((state) => state.getActiveAccount)();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<TSendTransactionForm>({
    resolver: zodResolver(
      SendTransactionSchema(network, activeAccount[network].balance)
    ),
    mode: "onChange",
    defaultValues: { toAddress: "", amount: "" },
  });

  if (step === 1) {
    return (
      <motion.form
        onSubmit={handleSubmit(() => setStep(2))}
        className="w-full max-w-lg relative flex flex-col items-center gap-4"
      >
        <Select
          options={Object.entries(activeAccount).map(
            ([network, { balance }]) => ({
              label: `${NETWORKS[network as TNetwork].name} (${
                parseBalance(balance).fixed
              } ${NETWORKS[network as TNetwork].token})`,
              value: network,
            })
          )}
          value={network}
          onChange={(value) => {
            setNetwork(value as TNetwork);
            reset();
          }}
          style="input"
        />

        {Object.keys(accounts).length > 1 ? (
          <Combobox
            name="toAddress"
            control={control}
            placeholder={`Recipient ${network} address`}
            options={Object.entries(accounts)
              .filter(([key]) => Number(key) !== activeAccountIndex)
              .map(([key, account]) => ({
                label: `Account ${Number(key) + 1}`,
                value: account[network].address,
                valueIcon: NETWORKS[network].icon,
                shortValue: getShortAddress(account[network].address, network),
              }))}
            autoComplete="off"
            autoCapitalize="off"
          />
        ) : (
          <Input
            {...register("toAddress")}
            placeholder={`Recipient ${network} address`}
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
          />
        )}

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

            if (parts[1] && parts[1].length > NETWORKS[network].decimals) {
              value =
                parts[0] +
                "." +
                parts[1].substring(0, NETWORKS[network].decimals);
            }

            if (value.startsWith(".")) {
              value = "0" + value;
            }

            target.value = value;
          }}
        />

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
      </motion.form>
    );
  }
};

export default SendTab;
