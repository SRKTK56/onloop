/**
 * OnToken + OnChain 両コントラクトを Base Mainnet にデプロイ
 * 実行: npx dotenv-cli -e .env.local -- npx tsx scripts/deploy-contracts.ts
 */
import { createWalletClient, createPublicClient, http } from "viem"
import { base } from "viem/chains"
import { privateKeyToAccount } from "viem/accounts"
import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadArtifact(name: string) {
  return JSON.parse(
    readFileSync(join(__dirname, `../artifacts/contracts/${name}.sol/${name}.json`), "utf-8")
  )
}

async function deploy(
  wallet: ReturnType<typeof createWalletClient>,
  client: ReturnType<typeof createPublicClient>,
  artifact: { abi: unknown; bytecode: `0x${string}` },
  args: unknown[],
  label: string
) {
  console.log(`\n[${label}] デプロイ中...`)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hash = await (wallet as any).deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode,
    args,
  })
  console.log(`[${label}] TX: ${hash}`)
  console.log(`[${label}] 確認待ち...`)
  const receipt = await client.waitForTransactionReceipt({ hash })
  console.log(`[${label}] ✅ ${receipt.contractAddress}`)
  return receipt.contractAddress as `0x${string}`
}

async function main() {
  const pk = process.env.ADMIN_PRIVATE_KEY as `0x${string}`
  if (!pk) throw new Error("ADMIN_PRIVATE_KEY が未設定です")

  const account = privateKeyToAccount(pk)
  console.log("デプロイアドレス:", account.address)

  const wallet = createWalletClient({ account, chain: base, transport: http() })
  const client = createPublicClient({ chain: base, transport: http() })

  const onTokenAddr = await deploy(wallet, client, loadArtifact("OnToken"), [account.address], "OnToken")
  const onChainAddr = await deploy(wallet, client, loadArtifact("OnChain"), [account.address], "OnChain")

  console.log("\n========================================")
  console.log("✅ デプロイ完了！")
  console.log("========================================")
  console.log("\n以下を環境変数に追加してください:\n")
  console.log(`ON_TOKEN_CONTRACT_ADDRESS=${onTokenAddr}`)
  console.log(`ON_CHAIN_CONTRACT_ADDRESS=${onChainAddr}`)
  console.log("\nVercelへの登録コマンド:")
  console.log(`  vercel env add ON_TOKEN_CONTRACT_ADDRESS production  → ${onTokenAddr}`)
  console.log(`  vercel env add ON_CHAIN_CONTRACT_ADDRESS production  → ${onChainAddr}`)
  console.log("========================================\n")
}

main().catch((err) => { console.error(err); process.exit(1) })
