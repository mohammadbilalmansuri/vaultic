"use client";
import useUserStore from "@/stores/userStore";

const TestnetNotice = () => {
  const networkMode = useUserStore((state) => state.networkMode);
  const userExists = useUserStore((state) => state.userExists);

  if (!userExists || networkMode !== "devnet") return null;

  return (
    <p className="w-full text-yellow-500 px-5 py-2 flex items-center justify-center gap-2 bg-yellow-500/10 border-1.5 border-yellow-500/10">
      You are currently in testnet mode.
    </p>
  );
};

export default TestnetNotice;
