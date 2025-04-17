"use client";
import { useState, Dispatch, SetStateAction, useTransition } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Button, Loader } from "@/components/ui";
import {
  TOnboardingStep,
  TNetwork,
  TImportWalletFormData,
  TMnemonicLength,
} from "@/types";
import useUserStore from "@/stores/userStore";
import { validateMnemonic } from "bip39";
import { useWallet, useClipboard } from "@/hooks";
import cn from "@/utils/cn";
import useNotificationStore from "@/stores/notificationStore";

type ImportWalletProps = {
  network: TNetwork;
  setStep: Dispatch<SetStateAction<TOnboardingStep>>;
};

const ImportWallet = ({ network, setStep }: ImportWalletProps) => {
  const setUserState = useUserStore((state) => state.setUserState);
  const notify = useNotificationStore((state) => state.notify);
  const { createWallet } = useWallet();
  const { handlePasteMnemonic } = useClipboard();

  const [mnemonicLength, setMnemonicLength] = useState<TMnemonicLength>(12);
  const [importing, startImporting] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors, isValid },
  } = useForm<TImportWalletFormData>({
    mode: "onChange",
    defaultValues: { mnemonic: Array(12).fill("") },
  });

  const handleImport = ({ mnemonic }: TImportWalletFormData) => {
    startImporting(async () => {
      const phrase = mnemonic.map((word) => word.trim()).join(" ");

      if (!validateMnemonic(phrase)) {
        setError("mnemonic", {
          type: "manual",
          message: "Invalid recovery phrase",
        });
        return;
      }

      clearErrors("mnemonic");

      try {
        setUserState({ mnemonic: phrase });
        await createWallet(network);
        notify({
          type: "success",
          message: "Wallet imported successfully!",
        });
        setStep(4);
      } catch (_) {
        notify({
          type: "error",
          message: "Failed to import wallet",
        });
      }
    });
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="box max-w-xl"
    >
      <h1 className="-mt-1">Secret Recovery Phrase</h1>
      <p className="max-w-sm">
        Enter your 12 or 24-word phrase. You can paste your full mnemonic into
        the first input field.
      </p>

      <form
        className="w-full flex flex-col gap-4.5 pt-2"
        onSubmit={handleSubmit(handleImport)}
      >
        <div className="w-full grid grid-cols-2 xs:grid-cols-3 gap-3">
          {Array(mnemonicLength)
            .fill("")
            .map((_, index) => (
              <div
                key={index}
                className="w-full flex items-center gap-2 p-3 rounded-xl transition-all duration-300 bg-zinc-200/60 dark:bg-zinc-800/50 focus-within:bg-zinc-200 dark:focus-within:bg-zinc-800"
              >
                <span className="opacity-80">{index + 1}.</span>
                <input
                  type="text"
                  {...register(`mnemonic.${index}`, {
                    required: true,
                    validate: (value) =>
                      value.trim().length > 0 || "Words cannot be empty",
                  })}
                  onPaste={
                    index === 0
                      ? (event) =>
                          handlePasteMnemonic(
                            event,
                            mnemonicLength,
                            setMnemonicLength,
                            setError,
                            clearErrors,
                            reset,
                            setValue
                          )
                      : undefined
                  }
                  className="w-full bg-transparent outline-none heading-color"
                />
              </div>
            ))}
        </div>

        {errors.mnemonic?.message && (
          <p className="py-1 text-yellow-500 text-sm">
            {errors.mnemonic.message}
          </p>
        )}

        <div className="w-full flex items-center gap-4">
          <Button
            variant="zinc"
            className="w-1/2"
            onClick={() => {
              setMnemonicLength((prev) => (prev === 12 ? 24 : 12));
              reset({ mnemonic: Array(mnemonicLength).fill("") });
              clearErrors("mnemonic");
            }}
          >
            {`Use ${mnemonicLength === 12 ? "24" : "12"} words`}
          </Button>
          <Button
            className={cn("w-1/2", {
              "pointer-events-none opacity-40": !isValid,
            })}
            type="submit"
            disabled={!isValid}
          >
            {importing ? <Loader size="sm" color="black" /> : "Import"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ImportWallet;
