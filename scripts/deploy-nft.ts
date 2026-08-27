/**
 * OnLoopNFT — Base Mainnet デプロイ
 * 実行: npx dotenv-cli -e .env.local -- npx tsx scripts/deploy-nft.ts
 */
import { createWalletClient, createPublicClient, http } from "viem"
import { base } from "viem/chains"
import { privateKeyToAccount } from "viem/accounts"
import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const artifact  = JSON.parse(
  readFileSync(join(__dirname, "../artifacts/contracts/OnLoopNFT.sol/OnLoopNFT.json"), "utf-8")
)

const BASE_URI   = "https://onloop-one.vercel.app/nft-full/metadata/"
const MINT_PRICE = "0.0003 ETH (約100円)"

async function main() {
  const pk = process.env.ADMIN_PRIVATE_KEY as `0x${string}`
  if (!pk) throw new Error("ADMIN_PRIVATE_KEY が未設定です")

  const account = privateKeyToAccount(pk)
  console.log("\nデプロイアドレス:", account.address)
  console.log("Base URI:", BASE_URI)
  console.log("ミント価格:", MINT_PRICE)
  console.log("最大供給数: 500\n")

  const wallet = createWalletClient({ account, chain: base, transport: http() })
  const client = createPublicClient({ chain: base, transport: http() })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hash = await (wallet as any).deployContract({
    abi:      artifact.abi,
    bytecode: artifact.bytecode,
    args:     [BASE_URI, account.address],
  })

  console.log("TX:", hash)
  console.log("確認待ち...")

  const receipt = await client.waitForTransactionReceipt({ hash })
  const addr    = receipt.contractAddress

  console.log("\n========================================")
  console.log("✅ OnLoopNFT デプロイ完了！")
  console.log("========================================")
  console.log("コントラクトアドレス:", addr)
  console.log("Basescan:", `https://basescan.org/address/${addr}`)
  console.log("\n次のステップ:")
  console.log(`  ! echo "NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=${addr}" >> .env.local`)
  console.log(`  vercel env add NEXT_PUBLIC_NFT_CONTRACT_ADDRESS production → ${addr}`)
  console.log("========================================\n")
}

main().catch(err => { console.error("❌", err); process.exit(1) })
