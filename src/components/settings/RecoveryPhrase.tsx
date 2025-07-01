"use client";
import { motion } from "motion/react";
import { ITabContentProps } from "@/types";
import { useWalletStore } from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import { MnemonicView } from "../ui";

const RecoveryPhrase = ({
  showInitialAnimation,
  initialAnimationDelay,
}: ITabContentProps) => {
  const mnemonic = useWalletStore((state) => state.mnemonic);

  const animationProps = fadeUpAnimation({
    delay: showInitialAnimation ? initialAnimationDelay : undefined,
  });

  return (
    <motion.div className="box max-w-lg gap-0" {...animationProps}>
      <h3 className="w-full text-lg font-medium heading-color border-b-1.5 border-color py-3">
        Your Recovery Phrase
      </h3>

      <div className="w-full flex flex-col gap-6 p-6">
        <div className="w-full p-5 rounded-2xl bg-warning text-center flex flex-col justify-center gap-2.5">
          <p className="font-semibold">
            Do <span className="underline">not</span> share your Recovery
            Phrase!
          </p>
          <p>
            If someone has your Recovery Phrase they will have full control of
            your wallet.
          </p>
        </div>

        <MnemonicView mnemonic={mnemonic} />
      </div>
    </motion.div>
  );
};

export default RecoveryPhrase;
