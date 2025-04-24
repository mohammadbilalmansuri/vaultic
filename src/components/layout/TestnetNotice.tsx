"use client";
import useUserStore from "@/stores/userStore";

const TestnetNotice = () => {
  const networkMode = useUserStore((state) => state.networkMode);
  const authenticated = useUserStore((state) => state.authenticated);

  if (!authenticated || networkMode !== "devnet") return null;

  return (
    <p className="w-full bg-warning px-5 py-2 flex items-center justify-center">
      You are currently in testnet mode.
    </p>
  );
};

export default TestnetNotice;
