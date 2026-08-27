import { createPublicClient, http } from "viem"
import { base } from "viem/chains"
import { NFT_CONTRACT_ADDRESS, NFT_ABI, MAX_SUPPLY } from "./nft"
import stageMap from "./nft-stage-map.json" assert { type: "json" }

// レアリティレベル → 報酬倍率（最大×2.0）
const NFT_MULTIPLIERS: Record<number, number> = {
  0: 1.0,  // 未保有
  1: 1.1,  // Common
  2: 1.3,  // Uncommon
  3: 1.6,  // Rare
  4: 1.8,  // Epic
  5: 2.0,  // Legendary
}

export function nftMultiplier(rarityLevel: number): number {
  return NFT_MULTIPLIERS[rarityLevel] ?? 1.0
}

const publicClient = createPublicClient({ chain: base, transport: http() })

/**
 * ウォレットが保有するNFTの最高レアリティレベルを返す（0=未保有）
 * multicallで全500トークンを一括チェック
 */
export async function getHighestRarityLevel(walletAddress: string): Promise<number> {
  try {
    const results = await publicClient.multicall({
      contracts: Array.from({ length: MAX_SUPPLY }, (_, i) => ({
        address:      NFT_CONTRACT_ADDRESS,
        abi:          NFT_ABI,
        functionName: "ownerOf" as const,
        args:         [BigInt(i + 1)] as const,
      })),
      allowFailure: true,
    })

    let highest = 0
    const lower = walletAddress.toLowerCase()

    results.forEach((r, i) => {
      if (r.status !== "success") return
      const owner = (r.result as string).toLowerCase()
      if (owner !== lower) return
      const tokenId = i + 1
      const level   = (stageMap as Record<string, number>)[String(tokenId)] ?? 0
      if (level > highest) highest = level
    })

    return highest
  } catch {
    return 0  // エラー時は倍率なし
  }
}
