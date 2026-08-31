import { createWalletClient, createPublicClient, http } from "viem"
import { base } from "viem/chains"
import { privateKeyToAccount } from "viem/accounts"
import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const artifact = JSON.parse(
  readFileSync(join(__dirname, "../artifacts/contracts/OnToken.sol/OnToken.json"), "utf-8")
)

async function main() {
  const pk = process.env.ADMIN_PRIVATE_KEY as `0x${string}`
  if (!pk) throw new Error("ADMIN_PRIVATE_KEY が .env.local に設定されていません")

  const account = privateKeyToAccount(pk)
  console.log("\nデプロイアドレス:", account.address)

  const wallet = createWalletClient({ account, chain: base, transport: http() })
  const client = createPublicClient({ chain: base, transport: http() })

  const hash = await wallet.deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode,
    args: [account.address],
  })
  console.log("TX hash:", hash)
  console.log("確認待ち...")

  const receipt = await client.waitForTransactionReceipt({ hash })
  console.log("\n✅ OnToken（譲渡不可）デプロイ完了!")
  console.log("旧: 0x84e54ce64d13220365f5d1cb4a6fcc5bf35c6ac3（譲渡可能・totalSupply 0・破棄してよい）")
  console.log("コントラクトアドレス:", receipt.contractAddress)
  console.log("\n次のステップ:")
  console.log("  ! vercel env add ON_TOKEN_CONTRACT_ADDRESS")
  console.log("  → 値:", receipt.contractAddress)
  console.log("  → 環境: Production + Preview\n")
}

main().catch((err) => { console.error(err); process.exit(1) })
