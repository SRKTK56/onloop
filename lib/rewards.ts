export type RewardEvent =
  | { type: "new_hop"; chainId: number; participants: string[]; newReceiver: string }
  | { type: "loop_complete"; chainId: number; participants: string[]; origin: string }

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
// 起点者 N×20 / 起点者以外 N×10（2026-09-01 に早期中継者ボーナスを廃止して統一）
//
// stageMultiplier: 連鎖の長さで決まるステージ倍率（村×1 〜 宇宙×20）。
// 「ループが続くほど報われる」というこのプロダクトの中核をここで表現する。
export function calcLoopRewards(
  participants: string[],
  origin: string,
  stageMultiplier: number = 1
) {
  const n = participants.length
  const rewards: Record<string, number> = {}

  for (const wallet of participants) {
    const base = wallet === origin ? n * 20 : n * 10
    rewards[wallet] = Math.round(base * stageMultiplier)
  }

  return rewards
}
