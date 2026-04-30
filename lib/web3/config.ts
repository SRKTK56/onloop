import { http, createConfig, noopStorage, createStorage } from "wagmi"
import { base, baseSepolia } from "wagmi/chains"
import { coinbaseWallet } from "wagmi/connectors"

export const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    coinbaseWallet({
      appName: "ONLOOP",
      preference: "all",
    }),
  ],
  transports: {
    [baseSepolia.id]: http("https://sepolia.base.org"),
    [base.id]: http("https://mainnet.base.org"),
  },
  // noopStorage prevents wagmi from persisting wallet state and auto-reconnecting
  // on mount, which caused ConnectWallet to show a spinner indefinitely
  storage: createStorage({ storage: noopStorage }),
})

export const CHAIN_ID =
  process.env.NEXT_PUBLIC_USE_MAINNET === "true" ? base.id : baseSepolia.id
