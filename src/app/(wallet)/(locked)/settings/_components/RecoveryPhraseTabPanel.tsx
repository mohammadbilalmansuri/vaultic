"use client";
import { motion } from "motion/react";
import type { TabPanelProps } from "@/types";
import { useWalletStore } from "@/stores";
import { fadeUpAnimation } from "@/utils/animations";
import { MnemonicView } from "@/components/shared";

const RecoveryPhraseTabPanel = ({
  showInitialAnimation,
  initialAnimationDelay,
}: TabPanelProps) => {
  const mnemonic = useWalletStore((state) => state.mnemonic);

  const animationProps = fadeUpAnimation({
    delay: showInitialAnimation ? initialAnimationDelay : undefined,
  });

  return (
    <motion.div className="box max-w-lg" {...animationProps}>
      <h2 className="w-full sm:text-lg text-md font-medium text-primary border-b-1.5 p-3">
        Your Recovery Phrase
      </h2>

      <div className="w-full flex flex-col items-center sm:gap-6 gap-5 sm:p-6 p-5">
        <div className="highlight-yellow border w-full p-4 rounded-2xl text-center flex flex-col items-center sm:gap-2.5 gap-2">
          <p className="font-semibold">
            <u>Never</u> share your Recovery Phrase.
          </p>
          <p className="sm:text-base text-15">
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

export default RecoveryPhraseTabPanel;
