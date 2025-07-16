import type { Children } from "@/types";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }: Children) => {
  return (
    <div className="w-full h-dvh max-h-dvh relative flex-1 flex lg:flex-row flex-col overflow-hidden">
      <Sidebar />
      <main
        role="main"
        aria-label="Dashboard Main Content"
        className="w-full relative flex-1 flex flex-col items-center lg:px-6 md:px-5 px-4 lg:pt-6 md:pt-2 pt-3 lg:pb-12 md:pb-10 pb-8 overflow-x-hidden"
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
