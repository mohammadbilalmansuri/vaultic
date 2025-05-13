export type TRouteCategory =
  | "authProtected" // Requires user to be logged in *and* verified with password
  | "authOnly" // Requires user to be logged in, but no password prompt
  | "guestOnly" // Only accessible to logged-out users
  | "semiProtected" // Publicly accessible, but requires password if user is logged in
  | "public" // Fully public, no auth or password required
  | null; // Unknown or uncategorized route

export type TOnboardingStep = 1 | 2 | 3 | 4 | 5 | 6;

export type TOnboardingPath = "create" | "import";

export type TNetwork = "ethereum" | "solana";

export type TNetworkMode = "mainnet" | "devnet";

export type TIndexes = {
  readonly network: TNetwork;
  readonly index: number;
}[];

export interface IWallet {
  readonly index: number;
  readonly network: TNetwork;
  readonly address: string;
  readonly privateKey: string;
  readonly balance: string;
}

export interface INotification {
  type?: "info" | "success" | "error";
  message: string;
  duration?: number;
}

export interface ISavedUserData {
  readonly hashedPassword: string;
  readonly encryptedMnemonic: string;
  readonly indexes: TIndexes;
  readonly deletedIndexes: TIndexes;
  readonly networkMode: TNetworkMode;
}

export interface ITxHistoryItem {
  readonly hash: string;
  readonly from: string;
  readonly to: string;
  readonly amount: string;
  readonly timestamp: number;
}

export type TImportWalletFormData = {
  mnemonic: string[];
};
