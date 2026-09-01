export type RewardEvent =
  | { type: "new_hop"; chainId: number; participants: string[]; newReceiver: string }
  | { type: "loop_complete"; chainId: number; participants: string[]; origin: string }

// Called when chain grows by one hop
//
// participants: このホップより前に確認済みの参加者（index 0 = 起点者）
// newReceiver:  今回恩を受け取った人
// giver:        今回恩を渡した人。
//
// giver を明示で受け取るのは、輪が閉じるホップで participants の末尾が
// 実際の贈り手にならないため（起点者が先頭と末尾の両方に現れ、重複除去で
// 末尾が落ちる）。以前は末尾を贈り手とみなしていたので、輪を閉じた本人が
// +2 を受け取れず、ひとつ前の人に二重に入っていた（2026-09-01 修正）。
export function calcHopRewards(
  participants: string[],
  newReceiver: string,
  giver?: string
) {
  const rewards: Record<string, number> = {}
  const origin = participants[0]

  // 起点者には毎ホップ +5
  rewards[origin] = (rewards[origin] ?? 0) + 5

  // 恩を渡した人に +2
  const forwarder = giver ?? participants[participants.length - 1]
  if (forwarder !== origin) {
    rewards[forwarder] = (rewards[forwarder] ?? 0) + 2
  }

  // 間にいる人（起点者でも贈り手でもない）に +1
  for (let i = 1; i < participants.length; i++) {
    const w = participants[i]
    if (w === forwarder) continue
    rewards[w] = (rewards[w] ?? 0) + 1
  }

  // 受け取った人に +1
  rewards[newReceiver] = (rewards[newReceiver] ?? 0) + 1

  return rewards
}

// Called when chain loops back to origin
//
// 各人の取り分 = 自分より後に輪へ加わった人数 × 20 × ステージ倍率。
//
// 「自分の恩がどこまで先に伝わったか」で報われる設計。
// 起点者が最も多く、後から入った人ほど少なくなるが、それは順位による
// 特別扱いではなく、実際にどれだけ先へ繋がったかの差になる。
//
// 最後の人は誰も後に続いていないが、恩を起点まで戻して輪を閉じたので1と数える。
//
// ステージ倍率は ×1〜×15（lib/stages.ts）。後続人数自体が連鎖の長さに比例するため
// 総発行は N² で伸びるが、ONは譲渡不可で上限も無いため額そのものは問題にしない。
// 想定する輪は20〜50人で、その帯（アジア→欧米→世界）の刻みを厚くしている。
export const ON_PER_FOLLOWER = 20

export function calcLoopRewards(participants: string[], stageMultiplier: number = 1) {
  const n = participants.length
  const rewards: Record<string, number> = {}

  participants.forEach((wallet, i) => {
    const followers = i === n - 1 ? 1 : n - 1 - i
    rewards[wallet] = Math.round(followers * ON_PER_FOLLOWER * stageMultiplier)
  })

  return rewards
}
