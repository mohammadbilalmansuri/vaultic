import { IChildren } from "@/types";
import Sidebar from "./Sidebar";
import TestnetNotice from "./TestnetNotice";

const DashboardLayout = ({ children }: IChildren) => {
  return (
    <div className="w-full h-dvh max-h-dvh relative flex-1 flex lg:flex-row flex-col overflow-hidden">
      <Sidebar />
      <main
        className="xl:w-[calc(100%-18rem)] lg:w-[calc(100%-16rem)] w-full relative flex flex-col"
        role="main"
        aria-label="Dashboard Main Content"
      >
        <TestnetNotice />
        <div
          className="w-full relative flex-1 flex flex-col items-center xl:p-8 sm:p-5 p-4 overflow-y-auto scrollbar-thin"
          role="region"
          aria-label="Dashboard Main Area"
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
