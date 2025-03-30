"use client";
import { useState, Dispatch, SetStateAction, ClipboardEvent } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui";
import { TStep } from "@/app/page";
import { useUserStore, TNetwork } from "@/stores/userStore";
import { validateMnemonic } from "bip39";
import cn from "@/utils/cn";
import { useWallet } from "@/hooks";

type ImportWalletProps = {
  network: TNetwork;
  setStep: Dispatch<SetStateAction<TStep>>;
};

type MnemonicForm = {
  mnemonic: string[];
};

const ImportWallet = ({ network, setStep }: ImportWalletProps) => {
  const [is24Words, setIs24Words] = useState(false);
  const setState = useUserStore((state) => state.setState);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm<MnemonicForm>({
    mode: "onChange",
    defaultValues: { mnemonic: Array(12).fill("") },
  });

  const [mnemonicErrors, setMnemonicErrors] = useState<string>("");
  const { createWallet } = useWallet();

  const onPaste = async (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text").trim();
    const words = text.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    if (wordCount === 12 || wordCount === 24) {
      if (wordCount !== (is24Words ? 24 : 12)) {
        setIs24Words(wordCount === 24);
      }
      setTimeout(() => {
        words.forEach((word, index) =>
          setValue(`mnemonic.${index}`, word, { shouldValidate: true })
        );
      }, 0);
    } else {
      setMnemonicErrors("Phrase must be 12 or 24 words.");
      setTimeout(() => setMnemonicErrors(""), 3000);
    }
  };

  const onSubmit = async (data: MnemonicForm) => {
    const phrase = data.mnemonic.map((word) => word.trim()).join(" ");
    if (validateMnemonic(phrase)) {
      setState({ mnemonic: phrase });
      await createWallet(network);
      setStep(4);
    } else {
      setMnemonicErrors("Invalid mnemonic phrase.");
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      exit={{ scale: 0.8, opacity: 0 }}
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
                className="w-full flex items-center gap-2 p-3 rounded-xl transition-all duration-400 bg-zinc-200/60 dark:bg-zinc-800/60 focus-within:bg-zinc-200 dark:focus-within:bg-zinc-800"
              >
                <span className="opacity-80">{index + 1}.</span>
                <input
                  type="text"
                  {...register(`mnemonic.${index}`, { required: true })}
                  onPaste={index === 0 ? onPaste : undefined}
                  className="w-full bg-transparent outline-none heading-color"
                />
              </div>
            ))}
        </div>

        {mnemonicErrors && (
          <p className="py-1 text-yellow-500 text-sm">{mnemonicErrors}</p>
        )}

        <div className="w-full flex items-center gap-4">
          <Button
            variant="zinc"
            className="w-1/2"
            onClick={() => setIs24Words((prev) => !prev)}
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
            Import
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ImportWallet;
