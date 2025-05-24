"use client";
import { useWalletStore } from "@/stores";
import { MnemonicView } from "../ui";

const RecoveryPhrase = () => {
  const mnemonic = useWalletStore((state) => state.mnemonic);

  return (
    <div className="w-full flex flex-col md:flex-row gap-6">
      <MnemonicView
        mnemonic={mnemonic}
        widthClassName="w-full md:w-[65%]"
        cols={4}
      />

      <div className="w-full md:w-[35%] p-5 rounded-2xl bg-warning text-center flex flex-col justify-center gap-3">
        <p className="font-semibold">
          Do <span className="underline">not</span> share your Recovery Phrase!
        </p>
        <p>
          If someone has your Recovery Phrase they will have full control of
          your wallet.
        </p>
      </div>
    </div>
  );
};

export default RecoveryPhrase;
