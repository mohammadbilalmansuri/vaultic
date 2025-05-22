import { IChildren } from "@/types";
import { Sidebar } from "@/components/layout";

const DashboardShell = ({ children }: IChildren) => {
  return (
    <>
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </>
  );
};

export default DashboardShell;
