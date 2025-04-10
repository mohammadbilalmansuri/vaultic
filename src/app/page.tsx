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
} from "@/components/home";
import { TNetwork } from "@/types";
import cn from "@/utils/cn";

export type TStep = 1 | 2 | 3 | 4 | 5 | 6;
export type TPath = "create" | "import" | null;

const TOTAL_STEPS = {
  create: 6,
  import: 5,
};

const Home = () => {
  const [step, setStep] = useState<TStep>(1);
  const [path, setPath] = useState<TPath>(null);
  const [network, setNetwork] = useState<TNetwork>("solana");

  const totalSteps = path ? TOTAL_STEPS[path] : 6;

  const stepComponents: Record<TStep, JSX.Element> = {
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

      {/* Step Indicator */}
      {path && (
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }, (_, index) => (
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
      )}
    </div>
  );
};

export default Home;
