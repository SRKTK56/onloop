import { http, createConfig } from "wagmi"
import { base, baseSepolia } from "wagmi/chains"
import { coinbaseWallet } from "wagmi/connectors"

export const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    coinbaseWallet({
      appName: "ONLOOP",
      preference: "smartWalletOnly",
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
})

export const CHAIN_ID =
  process.env.NEXT_PUBLIC_USE_MAINNET === "true" ? base.id : baseSepolia.id
