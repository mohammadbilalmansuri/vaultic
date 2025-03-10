export const weiToEth = (wei: bigint) => Number(wei) / 1e18;
export const ethToWei = (eth: number) => BigInt(eth * 1e18);
export const lamportsToSol = (lamports: number) => lamports / 1e9;
export const solToLamports = (sol: number) => sol * 1e9;
