"use client";

import {
  Welcome,
  SelectNetwork,
  Agreement,
  GenerateWallet,
  ImportWallet,
  CreatePassword,
  Completion,
} from "@/components";
import { useOnboardingStore } from "@/store/onboarding";
import cn from "@/utils/cn";

export default function Page() {
  const { step, path } = useOnboardingStore();
  const stepsArray = path === "create" ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5];

  const renderStepComponent = () => {
    switch (step) {
      case 1:
        return <Welcome />;
      case 2:
        return <SelectNetwork />;
      case 3:
        return path === "create" ? <Agreement /> : <ImportWallet />;
      case 4:
        return path === "create" ? <GenerateWallet /> : null;
      case 5:
        return <CreatePassword />;
      case 6:
        return <Completion />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-fit flex flex-col items-center gap-8">
      {renderStepComponent()}

      <div className="flex items-center gap-2">
        {stepsArray.map((index) => (
          <span
            key={index}
            className={cn("size-3.5 rounded-full", {
              "bg-zinc-900/10 dark:bg-zinc-100/10": step < index,
              "bg-teal-500/40": step > index,
              "bg-teal-500": step === index,
            })}
          ></span>
        ))}
      </div>
    </div>
  );
}
