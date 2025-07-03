import { IChildren } from "@/types";
import { Sidebar, TestnetNotice } from "../layout";

const DashboardShell = ({ children }: IChildren) => {
  return (
    <div className="w-full h-dvh max-h-dvh relative flex-1 flex overflow-hidden">
      <Sidebar />
      <main
        className="w-[calc(100%-18rem)] relative flex flex-col"
        role="main"
        aria-label="Dashboard Main Content"
      >
        <TestnetNotice />
        <div
          className="w-full relative flex-1 flex flex-col items-center p-8 overflow-x-hidden overflow-y-auto scrollbar-thin"
          role="region"
          aria-label="Dashboard Main Area"
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardShell;
