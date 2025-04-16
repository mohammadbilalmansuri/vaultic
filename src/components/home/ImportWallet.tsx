"use client";
import {
  useState,
  Dispatch,
  SetStateAction,
  ClipboardEvent,
  useTransition,
  KeyboardEvent,
  useEffect,
} from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Button, Loader } from "@/components/ui";
import { TOnboardingStep, TNetwork } from "@/types";
import useUserStore from "@/stores/userStore";
import { validateMnemonic } from "bip39";
import { useWallet } from "@/hooks";
import cn from "@/utils/cn";
import useNotificationStore from "@/stores/notificationStore";

type ImportWalletProps = {
  network: TNetwork;
  setStep: Dispatch<SetStateAction<TOnboardingStep>>;
};

type MnemonicForm = {
  mnemonic: string[];
};

const ImportWallet = ({ network, setStep }: ImportWalletProps) => {
  const setUserState = useUserStore((state) => state.setUserState);
  const notify = useNotificationStore((state) => state.notify);
  const { createWallet } = useWallet();

  const [is24Words, setIs24Words] = useState(false);
  const [importing, startImporting] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    reset,
    formState: { errors, isValid },
  } = useForm<MnemonicForm>({
    mode: "onChange",
    defaultValues: { mnemonic: Array(12).fill("") },
  });

  useEffect(() => {
    reset({ mnemonic: Array(is24Words ? 24 : 12).fill("") });
  }, [is24Words, reset]);

  const onSubmit = () => {
    startImporting(async () => {
      const phrase = getValues("mnemonic")
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
          message: "Wallet imported successfully!",
        });
        setStep(4);
      } catch (error) {
        notify({
          type: "error",
          message: "Failed to import wallet",
        });
      }
    });
  };

  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    try {
      const text = event.clipboardData.getData("text").trim();
      const words = text.split(/\s+/).filter(Boolean);
      const wordCount = words.length;

      if (wordCount === 12 || wordCount === 24) {
        if (wordCount !== (is24Words ? 24 : 12)) {
          setIs24Words(wordCount === 24);
          reset({ mnemonic: Array(wordCount).fill("") });
        }

        words.forEach((word, index) =>
          setValue(`mnemonic.${index}`, word, { shouldValidate: true })
        );

        clearErrors("mnemonic");
      } else {
        setError("mnemonic", {
          type: "manual",
          message: "The recovery phrase must contain exactly 12 or 24 words",
        });
        setTimeout(() => clearErrors("mnemonic"), 4000);
      }
    } catch (error) {
      console.error("Failed to paste recovery phrase:", error);
      setError("mnemonic", {
        type: "manual",
        message: "Something went wrong while pasting the recovery phrase",
      });
      setTimeout(() => clearErrors("mnemonic"), 4000);
    }
  };

  const handleKeyDown =
    (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === " " && index < (is24Words ? 23 : 11)) {
        event.preventDefault();
        const nextField = document.querySelector<HTMLInputElement>(
          `input[name="mnemonic.${index + 1}"]`
        );
        nextField?.focus();
      }
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
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full grid grid-cols-2 xs:grid-cols-3 gap-3">
          {Array(is24Words ? 24 : 12)
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
                  onPaste={index === 0 ? onPaste : undefined}
                  onKeyDown={handleKeyDown(index)}
                  className="w-full bg-transparent outline-none heading-color"
                  autoCapitalize="none"
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
              const count = is24Words ? 12 : 24;
              reset({ mnemonic: Array(count).fill("") });
              setIs24Words((prev) => !prev);
              clearErrors("mnemonic");
            }}
          >
            {is24Words ? "Use 12 words" : "Use 24 words"}
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
