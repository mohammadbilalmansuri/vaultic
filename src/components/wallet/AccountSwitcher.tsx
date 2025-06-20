"use client";
import { useAccountsStore, useNotificationStore } from "@/stores";
import { TSelectStyle, TSelectVariant } from "@/types";
import { useAccounts } from "@/hooks";
import { Select } from "../ui";

interface AccountSwitcherProps {
  variant?: TSelectVariant;
  style?: TSelectStyle;
}

const AccountSwitcher = ({
  variant = "dropdown",
  style = "default",
}: AccountSwitcherProps) => {
  const { switchActiveAccount } = useAccounts();
  const notify = useNotificationStore((state) => state.notify);
  const accounts = useAccountsStore((state) => state.accounts);
  const activeAccountIndex = useAccountsStore(
    (state) => state.activeAccountIndex
  );
  const switchingToAccount = useAccountsStore(
    (state) => state.switchingToAccount
  );
  const setSwitchingToAccount = useAccountsStore(
    (state) => state.setSwitchingToAccount
  );

  const handleSwitch = async (index: number) => {
    if (switchingToAccount !== null || index === activeAccountIndex) return;
    setSwitchingToAccount(index);
    try {
      await switchActiveAccount(index);
      notify({ type: "success", message: `Switched to Account ${index + 1}` });
    } catch {
      notify({ type: "error", message: `Failed to switch account` });
    } finally {
      setSwitchingToAccount(null);
    }
  };

  return (
    <Select
      options={Object.keys(accounts)
        .map(Number)
        .sort((a, b) => a - b)
        .map((index) => ({ label: `Account ${index + 1}`, value: index }))}
      value={activeAccountIndex}
      onChange={handleSwitch}
      selecting={switchingToAccount !== null}
      variant={variant}
      style={style}
    />
  );
};

export default AccountSwitcher;
