"use client";
import {
  useState,
  Dispatch,
  SetStateAction,
  useTransition,
  ClipboardEvent,
} from "react";
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
import useNotificationStore from "@/stores/notificationStore";
import { validateMnemonic } from "bip39";
import { useWallet } from "@/hooks";
import cn from "@/utils/cn";
import delay from "@/utils/delay";

type ImportWalletProps = {
  network: TNetwork;
  setStep: Dispatch<SetStateAction<TOnboardingStep>>;
};

const ImportWallet = ({ network, setStep }: ImportWalletProps) => {
  const setUserState = useUserStore((state) => state.setUserState);
  const notify = useNotificationStore((state) => state.notify);
  const { createWallet } = useWallet();

  const [mnemonicLength, setMnemonicLength] = useState<TMnemonicLength>(12);
  const [importing, startImporting] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<TImportWalletFormData>({
    mode: "onChange",
    defaultValues: { mnemonic: Array(24).fill("") },
  });

  const handleImport = ({ mnemonic }: TImportWalletFormData) => {
    startImporting(async () => {
      const phrase = mnemonic
        .slice(0, mnemonicLength)
        .map((word) => word.trim())
        .join(" ");

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
          message: "Wallet imported successfully.",
        });
        setStep(4);
      } catch (_) {
        notify({
          type: "error",
          message:
            "Something went wrong while importing your wallet. Please try again.",
        });
      }
    });
  };

  const getPasteHandler = (index: number) =>
    index === 0
      ? async (event: ClipboardEvent<HTMLInputElement>) => {
          event.preventDefault();

          const text = event.clipboardData.getData("text").trim();
          const words = text.split(/\s+/).filter(Boolean);
          const wordCount = words.length;

          if (wordCount === 12 || wordCount === 24) {
            if (wordCount !== mnemonicLength) setMnemonicLength(wordCount);

            words.forEach((word, index) =>
              setValue(`mnemonic.${index}`, word, { shouldValidate: true })
            );

            clearErrors("mnemonic");
          } else {
            setError("mnemonic", {
              type: "manual",
              message:
                "The recovery phrase must contain exactly 12 or 24 words",
            });

            notify({
              type: "error",
              message: "Invalid recovery phrase length",
            });

            await delay(2000);
            clearErrors("mnemonic");
          }
        }
      : undefined;

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
          {Array.from({ length: mnemonicLength }, (_, index) => (
            <div
              key={index}
              className="w-full flex items-center gap-2 p-3 rounded-xl transition-all duration-300 bg-zinc-200/60 dark:bg-zinc-800/50 focus-within:bg-zinc-200 dark:focus-within:bg-zinc-800"
            >
              <span className="opacity-80">{index + 1}.</span>
              <input
                type="text"
                {...register(`mnemonic.${index}`, {
                  required: true,
                  validate: (value) => value.trim() !== "",
                })}
                onPaste={getPasteHandler(index)}
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
