import { IChildren } from "@/types";
import { Sidebar, TestnetNotice } from "../layout";

const DashboardShell = ({ children }: IChildren) => {
  return (
    <div className="w-full relative flex-1 flex overflow-hidden">
      <Sidebar />
      <main className="w-full relative flex flex-col">
        <TestnetNotice />
        <div className="w-full relative flex flex-col items-center p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardShell;
