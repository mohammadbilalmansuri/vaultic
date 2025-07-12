import { IChildren } from "@/types";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }: IChildren) => {
  return (
    <div className="w-full h-dvh max-h-dvh relative flex-1 flex lg:flex-row flex-col overflow-hidden">
      <Sidebar />
      <main
        role="main"
        aria-label="Dashboard Main Content"
        className="w-full relative flex-1 flex flex-col items-center lg:px-8 lg:py-8 sm:px-5 sm:py-3 px-4 py-2 overflow-x-hidden"
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
