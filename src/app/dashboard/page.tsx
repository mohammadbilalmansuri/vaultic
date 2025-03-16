"use client";
import { AccountSettings, Send, Wallets } from "@/components/dashboard";

const Page = () => {
  return (
    <div className="w-full max-w-screen-lg relative flex flex-col items-center flex-1 gap-5 py-2">
      <AccountSettings />
      <Send />
      <Wallets />
    </div>
  );
};

export default Page;
