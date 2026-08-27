import { createWalletClient, http, parseEther } from "viem"
import { base } from "viem/chains"
import { privateKeyToAccount } from "viem/accounts"

const MINT_ABI = [
  {
    name: "mint",
    type: "function" as const,
    inputs: [
      { name: "to",     type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
]

function getWalletClient() {
  const pk      = process.env.ADMIN_PRIVATE_KEY?.trim()      as `0x${string}`
  const address = process.env.ON_TOKEN_CONTRACT_ADDRESS?.trim() as `0x${string}`
  if (!pk || !address) throw new Error("ADMIN_PRIVATE_KEY / ON_TOKEN_CONTRACT_ADDRESS が未設定")
  return {
    wallet:  createWalletClient({ account: privateKeyToAccount(pk), chain: base, transport: http() }),
    address,
  }
}

/**
 * ONトークンをオンチェーンでMintする
 * - 失敗してもDB報酬は影響しないよう、呼び出し元でtry-catchすること
 */
export async function mintOnToken(to: string, amount: number): Promise<`0x${string}`> {
  const { wallet, address } = getWalletClient()
  return wallet.writeContract({
    address,
    abi: MINT_ABI,
    functionName: "mint",
    args: [to as `0x${string}`, parseEther(amount.toString())],
  })
}

/**
 * 複数アドレスへ順次Mint（nonce衝突を避けるため直列実行）
 */
export async function mintBatch(rewards: Record<string, number>): Promise<void> {
  for (const [wallet, amount] of Object.entries(rewards)) {
    if (amount <= 0) continue
    try {
      const hash = await mintOnToken(wallet, amount)
      console.log(`[ontoken] mint ${amount} ON → ${wallet} tx:${hash}`)
    } catch (err) {
      console.error(`[ontoken] mint failed for ${wallet}:`, err)
    }
  }
}
