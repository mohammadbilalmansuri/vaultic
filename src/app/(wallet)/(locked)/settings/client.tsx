"use client";
import { motion } from "motion/react";
import type { TabsData } from "@/types";
import { fadeUpAnimation } from "@/utils/animations";
import { useWalletAuth } from "@/hooks";
import { Lock, Setting } from "@/components/icons";
import { Tabs } from "@/components/shared";
import { Tooltip } from "@/components/ui";
import RecoveryPhraseTabPanel from "./_components/recovery-phrase-tab-panel";
import TestnetModeTabPanel from "./_components/testnet-mode-tab-panel";
import ChangePasswordTabPanel from "./_components/change-password-tab-panel";
import RemoveWalletTabPanel from "./_components/remove-wallet-tab-panel";

const TABS: TabsData = [
  { label: "Recovery Phrase", panel: RecoveryPhraseTabPanel },
  { label: "Testnet Mode", panel: TestnetModeTabPanel },
  { label: "Change Password", panel: ChangePasswordTabPanel },
  { label: "Remove Wallet", panel: RemoveWalletTabPanel },
];

export const SettingsClient = () => {
  const { lockWallet } = useWalletAuth();

  return (
    <div className="w-full max-w-screen-lg relative flex flex-col md:gap-6 gap-5">
      <motion.div
        className="w-full relative flex items-center justify-between gap-3"
        {...fadeUpAnimation()}
      >
        <div className="flex items-center sm:gap-3 gap-2.5">
          <span
            className="highlight-teal sm:size-12 size-11 rounded-xl border hidden xs:flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <Setting className="w-6" />
          </span>

          <div>
            <h1 className="sm:text-xl text-lg font-semibold text-primary">
              Settings
            </h1>
            <p className="sm:text-base text-sm">
              Security, recovery, and network preferences.
            </p>
          </div>
        </div>

        <Tooltip content="Lock Wallet" position="left">
          <button
            type="button"
            className="icon-btn-bg"
            onClick={lockWallet}
            aria-label="Lock wallet"
          >
            <Lock className="sm:w-5.5 w-5" />
          </button>
        </Tooltip>
      </motion.div>

      <Tabs
        tabs={TABS}
        delay={{ list: 0.05, panel: 0.1 }}
        buttonClassName="py-3.5"
      />
    </div>
  );
};
