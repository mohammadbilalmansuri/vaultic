"use client";
import { TTabs } from "@/types";
import {
  ChangePassword,
  TestnetMode,
  RemoveAccount,
  RecoveryPhrase,
} from "@/components/settings";
import { Tabs } from "@/components/ui";

const TABS: TTabs = {
  "Recovery Phrase": { content: RecoveryPhrase },
  "Testnet Mode": { content: TestnetMode },
  "Change Password": { content: ChangePassword },
  "Remove Account": { content: RemoveAccount },
} as const;

const SettingsPage = () => {
  return (
    <div className="w-full max-w-screen-lg relative flex flex-col flex-1 py-5">
      <Tabs tabs={TABS} />
    </div>
  );
};

export default SettingsPage;
