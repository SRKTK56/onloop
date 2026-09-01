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
//
// 起点者 100 / 起点者以外 50 に、ステージ倍率（村×1 〜 宇宙×20）を掛ける。
//
// 以前は N×20 / N×10 だったが、ステージ倍率も連鎖の長さで決まるため
// N が二重に効いて発行量が N² で膨らんでいた（連鎖100の輪1本で202万ON）。
// 2026-09-01 に 1人あたりの額から N を外し、
// 「どの世界に到達したか」だけが取り分を決める形に整理した。
// 連鎖が長いほど報われるという性質は、ステージ倍率が引き継いでいる。
export function calcLoopRewards(
  participants: string[],
  origin: string,
  stageMultiplier: number = 1
) {
  const rewards: Record<string, number> = {}

  for (const wallet of participants) {
    const base = wallet === origin ? 100 : 50
    rewards[wallet] = Math.round(base * stageMultiplier)
  }

  return rewards
}
