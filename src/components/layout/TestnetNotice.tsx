"use client";
import useUserStore from "@/stores/userStore";

const TestnetNotice = () => {
  const networkMode = useUserStore((state) => state.networkMode);
  const authenticated = useUserStore((state) => state.authenticated);

  if (!authenticated || networkMode !== "devnet") return null;

  return (
    <p className="w-full text-yellow-500 bg-yellow-500/10 px-5 py-2 flex items-center justify-center gap-2">
      You are currently in testnet mode.
    </p>
  );
};

export default TestnetNotice;
