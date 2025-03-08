"use client";
import { AccountSettings } from "@/components/dashboard";

const Page = () => {
  return (
    <div className="w-full max-w-screen-lg relative flex flex-col items-center flex-1 gap-8 py-2">
      <AccountSettings />
    </div>
  );
};

export default Page;
