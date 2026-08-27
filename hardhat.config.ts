import type { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-viem"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const config: HardhatUserConfig = {
  solidity: { version: "0.8.24", settings: { evmVersion: "cancun" } },
  networks: {
    base: {
      type: "http",
      url: "https://mainnet.base.org",
      accounts: process.env.ADMIN_PRIVATE_KEY ? [process.env.ADMIN_PRIVATE_KEY] : [],
      chainId: 8453,
    },
  },
}

export default config
