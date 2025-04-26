"use client";
import { MnemonicView } from "@/components/common";

const RecoveryPhrase = () => {
  return (
    <div className="w-full relative flex gap-4">
      <MnemonicView widthClassName="w-2/3" cols={4} />

      <div className="w-1/3 flex flex-col items-center justify-center text-center gap-2 p-4 rounded-2xl bg-warning">
        <p>
          You're viewing your recovery phrase.{" "}
          <strong>Do not share it with anyone.</strong>
        </p>

        <p>
          This phrase gives full access to your wallet — keep it private and
          secure.
        </p>
      </div>
    </div>
  );
};

export default RecoveryPhrase;
