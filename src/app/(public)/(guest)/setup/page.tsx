"use client";
import { useState, JSX } from "react";
import {
  ChoosePath,
  ShowRecoveryPhrase,
  ImportRecoveryPhrase,
  CreatePassword,
  Completion,
} from "@/components/setup";
import { Loader } from "@/components/ui";
import { TSetupPath, TSetupStep, TSetupSetPath, TSetupSetStep } from "@/types";

interface GetStepComponentProps {
  step: TSetupStep;
  path: TSetupPath;
  setStep: TSetupSetStep;
  setPath: TSetupSetPath;
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
      return <CreatePassword setStep={setStep} />;
    case 3:
      return path === "create" ? (
        <ShowRecoveryPhrase setStep={setStep} />
      ) : (
        <ImportRecoveryPhrase setStep={setStep} />
      );
    case 4:
      <Completion />;
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
