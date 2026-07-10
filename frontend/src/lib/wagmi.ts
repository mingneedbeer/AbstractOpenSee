import { http, createConfig } from "wagmi";
import { defineChain } from "viem";
import { metaMask } from "wagmi/connectors";

export const abstractTestnet = defineChain({
  id: 11_124,
  name: "Abstract Testnet",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://api.testnet.abs.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "AbstractScan",
      url: "https://explorer.testnet.abs.xyz",
    },
  },
  testnet: true,
});

export const config = createConfig({
  chains: [abstractTestnet],
  connectors: [metaMask()],
  transports: {
    [abstractTestnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
