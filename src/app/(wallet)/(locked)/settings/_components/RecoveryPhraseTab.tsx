"use client";
import { motion } from "motion/react";
import { ITabContentProps } from "@/types";
import { useWalletStore } from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import { MnemonicView } from "@/components/shared";

const RecoveryPhraseTab = ({
  showInitialAnimation,
  initialAnimationDelay,
}: ITabContentProps) => {
  const mnemonic = useWalletStore((state) => state.mnemonic);

  const animationProps = fadeUpAnimation({
    delay: showInitialAnimation ? initialAnimationDelay : undefined,
  });

  return (
    <motion.div className="box max-w-lg gap-0" {...animationProps}>
      <h3 className="w-full text-lg font-medium heading-color border-b-1.5 p-3">
        Your Recovery Phrase
      </h3>

      <div className="w-full flex flex-col gap-6 p-6">
        <div className="w-full p-5 rounded-2xl bg-warning text-warning text-center flex flex-col items-center gap-2.5">
          <p className="font-semibold">
            <u>Never</u> share your Recovery Phrase.
          </p>
          <p>
            It gives full access to your wallet. If someone gets it, they
            can&nbsp;
            <span className="font-semibold">steal your assets permanently</span>
            , and you&nbsp;
            <span className="font-semibold">won't be able to recover them</span>
            .
          </p>
        </div>

        <MnemonicView mnemonic={mnemonic} />
      </div>
    </motion.div>
  );
};

export default RecoveryPhraseTab;
