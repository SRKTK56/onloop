export type RewardEvent =
  | { type: "new_hop"; chainId: number; participants: string[]; newReceiver: string }
  | { type: "loop_complete"; chainId: number; participants: string[]; origin: string }

/**
 * NFT保有レアリティに基づく報酬倍率を各ウォレットの報酬に適用する
 * Plan A: 活動ブースター（max ×2.0）
 */
export function applyNFTBoost(
  rewards:    Record<string, number>,
  nftLevels:  Record<string, number>  // wallet → rarityLevel (0-5)
): Record<string, number> {
  const MULT: Record<number, number> = { 0:1.0, 1:1.1, 2:1.3, 3:1.6, 4:1.8, 5:2.0 }
  const boosted: Record<string, number> = {}
  for (const [wallet, amount] of Object.entries(rewards)) {
    const level = nftLevels[wallet] ?? 0
    boosted[wallet] = Math.round(amount * (MULT[level] ?? 1.0))
  }
  return boosted
}

// Called when chain grows by one hop
// participants: all wallets in chain before new hop (index 0 = origin)
export function calcHopRewards(participants: string[], newReceiver: string) {
  const rewards: Record<string, number> = {}

  // origin always gets +5
  rewards[participants[0]] = (rewards[participants[0]] ?? 0) + 5

  // the person who just forwarded (last in participants) gets +2
  const forwarder = participants[participants.length - 1]
  if (forwarder !== participants[0]) {
    rewards[forwarder] = (rewards[forwarder] ?? 0) + 2
  }

  // intermediaries (not origin, not forwarder) get +0.5 → stored as 1 per 2 (use integers, *2 scale)
  // We use integer math: multiply all by 2 to avoid decimals
  // Actually let's keep it simple: intermediaries get 1 ON per hop they're involved in
  for (let i = 1; i < participants.length - 1; i++) {
    rewards[participants[i]] = (rewards[participants[i]] ?? 0) + 1
  }

  // new receiver gets +1 for accepting
  rewards[newReceiver] = (rewards[newReceiver] ?? 0) + 1

  return rewards
}

// Called when chain loops back to origin
// B案: 起点者 N×20、早期中継者ボーナス付き（1番目×3.0 / 2番目×2.5 / 3番目×2.0 / 以降×1.0）
export function calcLoopRewards(participants: string[], origin: string) {
  const n = participants.length
  const rewards: Record<string, number> = {}
  const relayMultipliers: Record<number, number> = { 1: 3.0, 2: 2.5, 3: 2.0 }

  for (let i = 0; i < participants.length; i++) {
    const wallet = participants[i]
    if (wallet === origin) {
      rewards[wallet] = n * 20
    } else {
      const mult = relayMultipliers[i] ?? 1.0
      rewards[wallet] = Math.round(n * 5 * mult)
    }
  }

  return rewards
}
