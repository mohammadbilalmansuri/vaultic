"use client";
import { Dispatch, SetStateAction } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui";
import { Solana, Ethereum } from "@/components/ui/icons";
import { TOnboardingStep, TNetwork } from "@/types";
import useNotificationStore from "@/stores/notificationStore";
import { scaleUpAnimation } from "@/utils/animations";

type SelectNetworkProps = {
  setNetwork: Dispatch<SetStateAction<TNetwork>>;
  setStep: Dispatch<SetStateAction<TOnboardingStep>>;
};

const SelectNetwork = ({ setNetwork, setStep }: SelectNetworkProps) => {
  const notify = useNotificationStore((state) => state.notify);

  const handleSelect = (network: TNetwork) => {
    setNetwork(network);
    notify({
      type: "info",
      message: `Connected to the ${network} network securely.`,
    });
    setStep(3);
  };

  return (
    <motion.div {...scaleUpAnimation()} className="box">
      <h1 className="-mt-2 box-heading">Select Network</h1>
      <p>
        Vaultic supports Solana and Ethereum. Select the network you'd like to
        use first. You can add more wallets later on another network.
      </p>

      <div className="flex items-center gap-4 mt-3">
        <Button
          variant="zinc"
          className="gap-2.5"
          onClick={() => handleSelect("solana")}
        >
          <Solana className="h-4 min-w-fit" />
          <span className="mt-px">Solana</span>
        </Button>

        <Button
          variant="zinc"
          className="gap-2.5"
          onClick={() => handleSelect("ethereum")}
        >
          <Ethereum className="h-6 min-w-fit" />
          <span className="mt-px">Ethereum</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default SelectNetwork;
