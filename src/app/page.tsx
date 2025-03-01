"use client";
import { useState } from "react";
import {
  Welcome,
  SelectNetwork,
  Agreement,
  GenerateWallet,
  ImportWallet,
  CreatePassword,
  Completion,
} from "@/components/home";
import cn from "@/utils/cn";

export type TStep = 1 | 2 | 3 | 4 | 5 | 6;
export type TPath = "create" | "import" | null;
export type TNetwork = "solana" | "ethereum" | null;

const Page = () => {
  const [step, setStep] = useState<TStep>(1);
  const [path, setPath] = useState<TPath>("create");
  const [network, setNetwork] = useState<TNetwork>(null);

  const renderStepComponent = () => {
    switch (step) {
      case 1:
        return <Welcome setStep={setStep} setPath={setPath} />;
      case 2:
        return (
          <SelectNetwork
            path={path}
            setStep={setStep}
            setNetwork={setNetwork}
          />
        );
      case 3:
        return path === "import" ? (
          <ImportWallet />
        ) : (
          <Agreement setStep={setStep} />
        );
      case 4:
        return path === "create" ? (
          <GenerateWallet setStep={setStep} network={network} />
        ) : null;
      case 5:
        return <CreatePassword />;
      case 6:
        return <Completion />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-screen-lg relative flex flex-col items-center gap-8">
      {renderStepComponent()}

      <div className="flex items-center gap-2">
        {Array.from({ length: path === "create" ? 6 : 5 }, (_, index) => (
          <span
            key={index}
            className={cn("size-3 rounded-full", {
              "bg-zinc-900/10 dark:bg-zinc-100/10": step < index + 1,
              "bg-teal-500/40": step > index + 1,
              "bg-teal-500": step === index + 1,
            })}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Page;
