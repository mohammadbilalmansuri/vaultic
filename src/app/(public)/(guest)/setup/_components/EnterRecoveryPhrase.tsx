"use client";
import { useState, ClipboardEvent, JSX } from "react";
import { motion } from "motion/react";
import { validateMnemonic, wordlists } from "bip39";
import { useForm } from "react-hook-form";
import { TSetupSetStep } from "@/types";
import { useWalletStore } from "@/stores";
import { scaleUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { Button, FormError } from "@/components/ui";
import Link from "next/link";

type TEnterMnemonicForm = { [key: `word${number}`]: string };
type TMnemonicLength = 12 | 24;

const mnemonicWordValidator = (index: number) => (value: string) => {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return "Word cannot be empty";
  if (!wordlists.english.includes(trimmed))
    return `Word ${index + 1} is incorrect or misspelled`;
  return true;
};

const EnterRecoveryPhrase = ({
  setStep,
  StepProgress,
}: {
  setStep: TSetupSetStep;
  StepProgress: JSX.Element;
}) => {
  const [mnemonicLength, setMnemonicLength] = useState<TMnemonicLength>(12);
  const setWalletState = useWalletStore((state) => state.setWalletState);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    trigger,
    reset,
    getValues,

    formState: { errors, isValid },
  } = useForm<TEnterMnemonicForm>({
    mode: "onChange",
    defaultValues: Object.fromEntries(
      Array.from({ length: 12 }, (_, i) => [`word${i + 1}`, ""])
    ),
  });

  const updateMnemonicForm = (newLength: TMnemonicLength, words?: string[]) => {
    setMnemonicLength(newLength);

    const currentValues = getValues();
    const newValues = Object.fromEntries(
      Array.from({ length: 24 }, (_, i) => [
        `word${i + 1}`,
        i < newLength ? words?.[i] ?? currentValues[`word${i + 1}`] ?? "" : "",
      ])
    );

    reset(newValues);
    trigger();
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData("text").trim();
    const words = text.split(/\s+/).filter(Boolean);

    if (words.length === 1) return;
    event.preventDefault();

    if (words.length === 12 || words.length === 24) {
      updateMnemonicForm(words.length as TMnemonicLength, words);
    } else {
      setError("root", {
        message: "Recovery phrase must contain exactly 12 or 24 valid words.",
      });
      setTimeout(() => clearErrors("root"), 4000);
    }
  };

  const handleContinue = (data: TEnterMnemonicForm) => {
    const phrase = Array.from({ length: mnemonicLength }, (_, i) =>
      (data[`word${i + 1}`] || "").trim()
    ).join(" ");

    if (!validateMnemonic(phrase)) {
      setError("root", {
        message: "Invalid recovery phrase. Please check for typos.",
      });
      setTimeout(() => clearErrors("root"), 4000);
      return;
    }

    setWalletState({ mnemonic: phrase });
    setStep(4);
  };

  return (
    <motion.div
      key="enter-recovery-phrase"
      aria-label="Enter Recovery Phrase"
      className="box"
      {...scaleUpAnimation({ duration: 0.15 })}
    >
      {StepProgress}

      <div className="w-full flex flex-col items-center xs:gap-6 gap-5 xs:p-6 p-5">
        <h1>Enter Your Recovery Phrase</h1>
        <p className="-mt-2.5">
          Enter your 12- or 24-word recovery phrase to import your wallet. You
          can also paste the entire phrase into the first field to fill in the
          rest automatically.
        </p>

        <button
          type="button"
          onClick={() => updateMnemonicForm(mnemonicLength === 12 ? 24 : 12)}
          className="link text-teal-500 -mt-1"
        >
          {`Switch to ${mnemonicLength === 12 ? "24" : "12"} Words`}
        </button>

        <form
          className="w-full flex flex-col xs:gap-4 gap-3"
          onSubmit={handleSubmit(handleContinue)}
        >
          <div className="w-full grid grid-cols-3 gap-2">
            {Array.from({ length: mnemonicLength }, (_, index) => (
              <div key={index} className="mnemonic-word-input">
                <label
                  className="opacity-50 select-none"
                  htmlFor={`word${index + 1}`}
                >
                  {index + 1}.
                </label>
                <input
                  type="text"
                  id={`word${index + 1}`}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoFocus={index === 0}
                  {...register(`word${index + 1}`, {
                    required: true,
                    validate: mnemonicWordValidator(index),
                  })}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-full bg-transparent outline-none"
                />
              </div>
            ))}
          </div>

          <Button
            type="submit"
            disabled={!isValid}
            className={cn("w-full mt-0.5", {
              "opacity-60 pointer-events-none": !isValid,
            })}
          >
            Continue
          </Button>

          <FormError errors={errors} className="mt-2" />
        </form>
      </div>
    </motion.div>
  );
};

export default EnterRecoveryPhrase;
