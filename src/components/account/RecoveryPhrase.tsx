"use client";
import { MnemonicView } from "@/components/common";

const RecoveryPhrase = () => {
  return (
    <div className="w-full flex flex-col md:flex-row gap-6">
      <MnemonicView widthClassName="w-[65%]" cols={4} />

      <div className="w-full md:w-[35%] p-5 rounded-2xl bg-warning text-center flex flex-col justify-center gap-2">
        <p>
          You're viewing your recovery phrase. Never share this with anyone.
        </p>
        <p>
          This phrase gives full access to your wallet. Keep it private and
          secure.
        </p>
      </div>
    </div>
  );
};

export default RecoveryPhrase;
