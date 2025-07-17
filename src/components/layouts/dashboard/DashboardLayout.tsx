import type { Children } from "@/types";
import { TestnetStatus } from "@/components/shared";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }: Children) => {
  return (
    <div className="w-full h-dvh max-h-dvh relative flex-1 flex lg:flex-row flex-col overflow-hidden">
      <Sidebar />
      <main
        className="w-full relative flex flex-col items-center"
        role="main"
        aria-label="Dashboard Main Content"
      >
        <TestnetStatus variant="notice" className="w-full lg:block hidden" />
        <div className="w-full relative flex flex-col items-center overflow-x-hidden lg:px-6 md:px-5 px-4 lg:pt-6 md:pt-2 pt-3 lg:pb-12 md:pb-10 pb-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
