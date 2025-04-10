export type TNetwork = "ethereum" | "solana";

export type TIndexes = {
  network: TNetwork;
  index: number;
}[];

export type TNetworkMode = "mainnet" | "devnet";

export interface IUserState {
  authenticated: boolean;
  password: string;
  mnemonic: string;
  indexes: TIndexes;
  deletedIndexes: TIndexes;
  networkMode: TNetworkMode;
  setUserState: (updates: Partial<IUserState>) => void;
  setUser: (data: Partial<IUserState>) => void;
  clearUser: () => void;
}
