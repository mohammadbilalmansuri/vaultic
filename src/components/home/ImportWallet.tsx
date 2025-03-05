"use client";
import { useState, Dispatch, SetStateAction, ClipboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui";
import { TStep } from "@/app/page";
import { useUserStore } from "@/stores/userStore";
import { validateMnemonic } from "bip39";
import cn from "@/utils/cn";

type ImportWalletProps = {
  setStep: Dispatch<SetStateAction<TStep>>;
};

type MnemonicForm = {
  mnemonic: string[];
};

const ImportWallet = ({ setStep }: ImportWalletProps) => {
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

  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text").trim();
    const words = text.split(/\s+/);
    if (words.length === 12 || words.length === 24) {
      setIs24Words(words.length === 24);
      words.forEach((word, index) =>
        setValue(`mnemonic.${index}`, word, { shouldValidate: true })
      );
    }
  };

  const onSubmit = (data: MnemonicForm) => {
    const phrase = data.mnemonic.join(" ").trim();
    if (validateMnemonic(phrase)) {
      setState({ mnemonic: phrase });
      setStep(4);
    } else setMnemonicErrors("Invalid mnemonic phrase.");
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
        className="w-full flex flex-col gap-4 mt-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <motion.div
          key={is24Words ? "24" : "12"}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <motion.div
            className="w-full grid grid-cols-2 xs:grid-cols-3 gap-2.5"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05, ease: "easeOut" },
              },
            }}
          >
            <AnimatePresence>
              {Array(is24Words ? 24 : 12)
                .fill("")
                .map((_, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="w-full flex items-center gap-2 p-3 rounded-lg transition-all duration-200 bg-zinc-200/60 dark:bg-zinc-800/60 focus-within:bg-zinc-200 dark:focus-within:bg-zinc-800"
                  >
                    <span className="opacity-80">{index + 1}.</span>
                    <input
                      type="text"
                      {...register(`mnemonic.${index}`, { required: true })}
                      onPaste={index === 0 ? onPaste : undefined}
                      className="w-full bg-transparent outline-none heading-color"
                    />
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {mnemonicErrors && (
          <p className="py-1 text-yellow-500 text-sm">{mnemonicErrors}</p>
        )}

        <div className="w-full flex items-center gap-4">
          <Button
            variant="secondary"
            className="w-1/2"
            onClick={() => setIs24Words(!is24Words)}
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
