"use client";
import { motion } from "motion/react";
import type { TabsData } from "@/types";
import { fadeUpAnimation } from "@/utils/animations";
import { useWallet } from "@/hooks";
import { Lock, Wallet } from "@/components/icons";
import { Tabs } from "@/components/shared";
import { Tooltip } from "@/components/ui";
import RecoveryPhraseTab from "./_components/RecoveryPhraseTab";
import TestnetModeTab from "./_components/TestnetModeTab";
import ChangePasswordTab from "./_components/ChangePasswordTab";
import RemoveWalletTab from "./_components/RemoveWalletTab";

const TABS: TabsData = [
  { label: "Recovery Phrase", panel: RecoveryPhraseTab },
  { label: "Testnet Mode", panel: TestnetModeTab },
  { label: "Change Password", panel: ChangePasswordTab },
  { label: "Remove Wallet", panel: RemoveWalletTab },
];

const SettingsPage = () => {
  const { lockWallet } = useWallet();

  return (
    <div className="w-full max-w-screen-lg relative flex flex-col gap-6 flex-1">
      <motion.div
        className="w-full relative flex items-center justify-between gap-4"
        {...fadeUpAnimation()}
      >
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-teal-500/10 flex items-center justify-center">
            <Wallet className="w-6 text-teal-500" />
          </div>

          <div className="flex flex-col">
            <h2 className="text-xl font-semibold heading-color">Settings</h2>
            <p>Security, recovery, and network preferences.</p>
          </div>
        </div>

        <Tooltip content="Lock Wallet" position="left">
          <button className="icon-btn-bg" onClick={lockWallet}>
            <Lock />
          </button>
        </Tooltip>
      </motion.div>

      <Tabs tabs={TABS} delay={{ list: 0.1, panel: 0.2 }} />
    </div>
  );
};

export default SettingsPage;
