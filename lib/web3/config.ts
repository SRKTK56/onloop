import { http, createConfig, noopStorage, createStorage } from "wagmi"
import { base, baseSepolia, mainnet } from "wagmi/chains"
import { coinbaseWallet, baseAccount } from "wagmi/connectors"

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia, mainnet], // mainnetを追加：EthereumからBaseへの切り替えに必要
  connectors: [
    coinbaseWallet({
      appName: "ONLOOP",
      preference: "all",
    }),
    baseAccount(),
  ],
  transports: {
    [base.id]:        http("https://mainnet.base.org"),
    [baseSepolia.id]: http("https://sepolia.base.org"),
    [mainnet.id]:     http(),
  },
  // noopStorage prevents wagmi from persisting wallet state and auto-reconnecting
  // on mount, which caused ConnectWallet to show a spinner indefinitely
  storage: createStorage({ storage: noopStorage }),
})

export const CHAIN_ID =
  process.env.NEXT_PUBLIC_USE_MAINNET === "true" ? base.id : baseSepolia.id
