"use client";
import { useState, ClipboardEvent } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import SetupProgress from "./SetupProgress";
import { TImportMnemonicForm } from "@/utils/validations";
import { Button, FormError } from "@/components/ui";
import { validateMnemonic } from "bip39";
import { useWalletStore } from "@/stores";
import cn from "@/utils/cn";
import { scaleUpAnimation } from "@/utils/animations";
import { TSetupSetStep } from "@/types";

const ImportRecoveryPhrase = ({ setStep }: { setStep: TSetupSetStep }) => {
  const [mnemonicLength, setMnemonicLength] = useState<12 | 24>(12);
  const setWalletState = useWalletStore((state) => state.setWalletState);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    trigger,
    formState: { errors, isValid },
  } = useForm<TImportMnemonicForm>({
    mode: "onChange",
    defaultValues: { mnemonic: Array(24).fill("") },
  });

  const handleImport = ({ mnemonic }: TImportMnemonicForm) => {
    const phrase = mnemonic
      .slice(0, mnemonicLength)
      .map((word) => word.trim())
      .join(" ");

    if (!validateMnemonic(phrase)) {
      setError("mnemonic", { message: "Invalid recovery phrase" });
      setTimeout(() => clearErrors("mnemonic"), 4000);
      return;
    }

    clearErrors("mnemonic");
    setWalletState({ mnemonic: phrase });
    setStep(4);
  };

  const getPasteHandler = (index: number) =>
    index === 0
      ? (event: ClipboardEvent<HTMLInputElement>) => {
          event.preventDefault();
          const text = event.clipboardData.getData("text").trim();
          const words = text.split(/\s+/).filter(Boolean);
          const wordCount = words.length;

          if (wordCount === 12 || wordCount === 24) {
            if (wordCount !== mnemonicLength) setMnemonicLength(wordCount);

            words.forEach((word, i) =>
              setValue(`mnemonic.${i}`, word, { shouldValidate: true })
            );

            // for (let i = words.length; i < 24; i++) {
            //   setValue(`mnemonic.${i}`, "");
            // }

            clearErrors("mnemonic");
            trigger("mnemonic"); //
          } else {
            setError("mnemonic", {
              message:
                "The recovery phrase must contain exactly 12 or 24 mnemonic",
            });
            setTimeout(() => clearErrors("mnemonic"), 4000);
          }
        }
      : undefined;

  const handleSwitchLength = () => {
    setMnemonicLength((prev) => (prev === 12 ? 24 : 12));
    setTimeout(() => {
      trigger("mnemonic");
      clearErrors("mnemonic");
    }, 0);
  };

  return (
    <motion.div {...scaleUpAnimation()} className="setup-box gap-0">
      <SetupProgress step={3} />

      <div className="p-6 w-full flex flex-col items-center gap-3">
        <h2>Enter Recovery Phrase</h2>
        <p>
          Enter your 12 or 24-word recovery phrase. You can paste your full
          phrase into the first input field.
        </p>

        <form
          className="w-full flex flex-col gap-4 mt-3"
          onSubmit={handleSubmit(handleImport)}
        >
          <div className="w-full grid grid-cols-2 xs:grid-cols-3 gap-2">
            {Array.from({ length: mnemonicLength }, (_, index) => (
              <div key={index} className="mnemonic-word-input">
                <label className="opacity-50" htmlFor={`mnemonic.${index}`}>
                  {index + 1}.
                </label>
                <input
                  type="text"
                  id={`mnemonic.${index}`}
                  autoComplete="off"
                  {...register(`mnemonic.${index}`, {
                    required: true,
                    validate: (value) => value.trim() !== "",
                  })}
                  onPaste={getPasteHandler(index)}
                  className="w-full bg-transparent outline-none"
                />
              </div>
            ))}
          </div>

          <div className="w-full flex items-center gap-4">
            <Button
              variant="zinc"
              className="w-1/2"
              type="button"
              onClick={handleSwitchLength}
            >
              {`Use ${mnemonicLength === 12 ? "24" : "12"} mnemonic`}
            </Button>

            <Button
              className={cn("w-1/2", {
                "pointer-events-none opacity-40": !isValid,
              })}
              type="submit"
              disabled={!isValid}
            >
              Import
            </Button>
          </div>

          <FormError errors={errors} className="mt-1.5" />
        </form>
      </div>
    </motion.div>
  );
};

export default ImportRecoveryPhrase;
