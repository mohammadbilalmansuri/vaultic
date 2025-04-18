"use client";
import { Dispatch, SetStateAction } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui";
import { Solana, Ethereum } from "@/components/ui/icons";
import { TOnboardingStep } from "@/types";
import { TNetwork } from "@/types";
import useNotificationStore from "@/stores/notificationStore";

type SelectNetworkProps = {
  setNetwork: Dispatch<SetStateAction<TNetwork>>;
  setStep: Dispatch<SetStateAction<TOnboardingStep>>;
};

const SelectNetwork = ({ setNetwork, setStep }: SelectNetworkProps) => {
  const notify = useNotificationStore((state) => state.notify);

  const setState = (network: TNetwork) => {
    setNetwork(network);
    notify({
      type: "info",
      message: `Connected to the ${network} network securely.`,
    });
    setStep(3);
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="box"
    >
      <h1 className="-mt-1">Select Network</h1>
      <p>
        Vaultic supports both the Solana and Ethereum networks. Which one would
        you like to use? You can add more wallets later on another network.
      </p>

      <div className="flex items-center gap-4 pt-2">
        <Button
          variant="zinc"
          className="gap-2.5"
          onClick={() => setState("solana")}
        >
          <Solana className="h-4 min-w-fit" />
          <span className="mt-px">Solana</span>
        </Button>

        <Button
          variant="zinc"
          className="gap-2.5"
          onClick={() => setState("ethereum")}
        >
          <Ethereum className="h-6 min-w-fit" />
          <span className="mt-px">Ethereum</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default SelectNetwork;
