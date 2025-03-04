"use client";
import { useState, JSX } from "react";
import {
  Welcome,
  SelectNetwork,
  Agreement,
  GenerateMnemonic,
  ImportWallet,
  CreatePassword,
  Completion,
} from "@/components/home";
import { TNetwork } from "@/stores/userStore";
import cn from "@/utils/cn";

export type TStep = 1 | 2 | 3 | 4 | 5 | 6;
export type TPath = "create" | "import" | null;

const TOTAL_STEPS = {
  create: 6,
  import: 5,
};

const Page = () => {
  const [step, setStep] = useState<TStep>(1);
  const [path, setPath] = useState<TPath>("create");
  const [network, setNetwork] = useState<TNetwork>("sol");

  const stepComponents: Record<TStep, JSX.Element | null> = {
    1: <Welcome setStep={setStep} setPath={setPath} />,
    2: <SelectNetwork setNetwork={setNetwork} path={path} setStep={setStep} />,
    3: path === "import" ? <ImportWallet /> : <Agreement setStep={setStep} />,
    4: path === "create" ? <GenerateMnemonic setStep={setStep} /> : null,
    5: <CreatePassword network={network} setStep={setStep} />,
    6: <Completion />,
  };

  return (
    <div className="w-full max-w-screen-lg relative flex flex-col items-center gap-8">
      {stepComponents[step]}

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {Array.from({ length: TOTAL_STEPS[path ?? "create"] }, (_, index) => (
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

export default Page;
