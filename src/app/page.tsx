"use client";
import { useState, JSX } from "react";
import {
  Welcome,
  SelectNetwork,
  SecretRecoveryWarning,
  GenerateWallet,
  ImportWallet,
  CreatePassword,
  Completion,
} from "@/components/onboarding";
import { TNetwork } from "@/types";
import cn from "@/utils/cn";
import { TOnboardingPath, TOnboardingStep } from "@/types";
import { ONBOARDING_STEPS } from "@/constants";

const Home = () => {
  const [step, setStep] = useState<TOnboardingStep>(1);
  const [path, setPath] = useState<TOnboardingPath>("create");
  const [network, setNetwork] = useState<TNetwork>("solana");

  const stepComponents: Record<TOnboardingStep, JSX.Element> = {
    1: <Welcome setStep={setStep} setPath={setPath} />,
    2: <SelectNetwork setNetwork={setNetwork} setStep={setStep} />,
    3:
      path === "create" ? (
        <SecretRecoveryWarning setStep={setStep} />
      ) : (
        <ImportWallet network={network} setStep={setStep} />
      ),
    4:
      path === "create" ? (
        <GenerateWallet network={network} setStep={setStep} />
      ) : (
        <CreatePassword setStep={setStep} />
      ),
    5:
      path === "create" ? <CreatePassword setStep={setStep} /> : <Completion />,
    6: <Completion />,
  };

  return (
    <div className="w-full max-w-screen-lg relative flex flex-col items-center gap-8">
      {stepComponents[step]}

      <div className="flex items-center gap-2">
        {Array.from({ length: ONBOARDING_STEPS[path] }, (_, index) => (
          <span
            key={index}
            className={cn("size-3 rounded-full", {
              "bg-zinc-300 dark:bg-zinc-700": step < index + 1,
              "bg-teal-500/50": step > index + 1,
              "bg-teal-500": step === index + 1,
            })}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
