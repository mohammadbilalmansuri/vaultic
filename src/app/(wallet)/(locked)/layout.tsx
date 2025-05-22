import { IChildren } from "@/types";
import { UnlockGuard, Sidebar } from "@/components/layout";
import { DashboardShell } from "@/components/shells";

const LockedLayout = ({ children }: IChildren) => {
  return (
    <UnlockGuard>
      <DashboardShell>{children}</DashboardShell>
    </UnlockGuard>
  );
};

export default LockedLayout;
