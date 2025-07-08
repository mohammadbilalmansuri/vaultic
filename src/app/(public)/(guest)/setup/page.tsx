"use client";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { TSetupPath, TSetupStep } from "@/types";
import { useMounted } from "@/hooks";
import { StepProgress } from "@/components/shared";
import ChoosePath from "./_components/ChoosePath";
import CreatePassword from "./_components/CreatePassword";
import ShowRecoveryPhrase from "./_components/ShowRecoveryPhrase";
import EnterRecoveryPhrase from "./_components/EnterRecoveryPhrase";
import SettingUpWallet from "./_components/SettingUpWallet";
import SetupComplete from "./_components/SetupComplete";

const getStepProgress = (activeDot: number, backFn?: () => void) => (
  <StepProgress dots={3} activeDot={activeDot} back={backFn} />
);

const SetupPage = () => {
  const [step, setStep] = useState<TSetupStep>(1);
  const [path, setPath] = useState<TSetupPath>("create");
  const hasMounted = useMounted(500);

  return (
    <AnimatePresence mode="wait">
      {step === 1 && (
        <ChoosePath
          setPath={setPath}
          setStep={setStep}
          hasMounted={hasMounted}
          key="choose-path"
        />
      )}

      {step === 2 && (
        <CreatePassword
          setStep={setStep}
          key="create-password"
          StepProgress={getStepProgress(1, () => setStep(1))}
        />
      )}

      {step === 3 &&
        (path === "create" ? (
          <ShowRecoveryPhrase
            setStep={setStep}
            key="show-recovery-phrase"
            StepProgress={getStepProgress(2)}
          />
        ) : (
          <EnterRecoveryPhrase
            setStep={setStep}
            key="enter-recovery-phrase"
            StepProgress={getStepProgress(2, () => setStep(2))}
          />
        ))}

      {step === 4 && (
        <SettingUpWallet
          path={path}
          setStep={setStep}
          key="setting-up-wallet"
          StepProgress={getStepProgress(3)}
        />
      )}

      {step === 5 && <SetupComplete path={path} key="setup-complete" />}
    </AnimatePresence>
  );
};

export default SetupPage;
