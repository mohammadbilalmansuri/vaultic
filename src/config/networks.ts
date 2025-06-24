import { Ethereum, Solana } from "../components/ui/icons";

/**
 * Network configuration object containing settings for all supported blockchains.
 * Each network includes RPC endpoints, fees, UI settings, and network-specific parameters.
 */
export const NETWORKS = {
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    token: "ETH",
    icon: Ethereum,
    testnetName: "Sepolia",
    decimals: 18,
    fee: "0.0001",
    rentExemption: "0",
    svgUrlForQR: "/ethereum.svg",
    txnSignatureLabel: "Hash",
    addressPrefixLength: 2,
    rpc: {
      mainnet: process.env.NEXT_PUBLIC_ETH_MAINNET_RPC!,
      testnet: process.env.NEXT_PUBLIC_ETH_SEPOLIA_RPC!,
    },
  },
  solana: {
    id: "solana",
    name: "Solana",
    token: "SOL",
    icon: Solana,
    testnetName: "Devnet",
    decimals: 9,
    fee: "0.00008",
    rentExemption: "0.00089088",
    svgUrlForQR: "/solana.svg",
    txnSignatureLabel: "Signature",
    addressPrefixLength: 0,
    rpc: {
      mainnet: process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC!,
      testnet: process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC!,
    },
  },
};
