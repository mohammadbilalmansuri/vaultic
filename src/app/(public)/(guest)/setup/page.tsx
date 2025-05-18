"use client";
import { useState, JSX, Dispatch, SetStateAction } from "react";
import {
  ChoosePath,
  RecoveryPhraseWarning,
  GenerateWallet,
  ImportWallet,
  CreatePassword,
  Completion,
} from "@/components/setup";
import { TSetupPath, TSetupStep } from "@/types";
import { Loader } from "@/components/ui";

interface GetStepComponentProps {
  step: TSetupStep;
  path: TSetupPath;
  setStep: Dispatch<SetStateAction<TSetupStep>>;
  setPath: Dispatch<SetStateAction<TSetupPath>>;
}

const getStepComponent = ({
  step,
  path,
  setStep,
  setPath,
}: GetStepComponentProps): JSX.Element => {
  switch (step) {
    case 1:
      return <ChoosePath setPath={setPath} setStep={setStep} />;
    case 2:
      return <CreatePassword path={path} setStep={setStep} />;
    case 3:
      return path === "create" ? (
        <RecoveryPhraseWarning setStep={setStep} />
      ) : (
        <ImportWallet setStep={setStep} />
      );
    case 4:
      return path === "create" ? (
        <GenerateWallet setStep={setStep} />
      ) : (
        <Completion />
      );
    case 5:
      return <Completion />;
    default:
      return <Loader />;
  }
};

const SetupPage = () => {
  const [step, setStep] = useState<TSetupStep>(1);
  const [path, setPath] = useState<TSetupPath>("create");

  return (
    <div className="w-full max-w-screen-lg relative flex flex-col items-center">
      {getStepComponent({ step, path, setStep, setPath })}
    </div>
  );
};

export default SetupPage;
