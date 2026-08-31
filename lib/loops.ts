import { db } from "@/lib/db"
import { chains, chainNodes, userProfiles, providers } from "@/lib/db/schema"
import { inArray, desc } from "drizzle-orm"
import { getStage } from "@/lib/stages"

/** 公開フィードに出す参加者。表示名が無い人は短縮アドレスに落とす */
export type Party = { wallet: string; name: string; named: boolean }

export type Hop = {
  position: number
  giver: Party
  receiver: Party
  description: string
  at: string | null
}

export type LoopItem = {
  chainId: number
  /** ステージ判定に使う連鎖の長さ（重複を除いた参加者数） */
  length: number
  stageId: string
  isLoop: boolean
  startedAt: string
  lastAt: string
  participants: Party[]
  /** 新しい順のホップ（フィード用に絞る） */
  hops: Hop[]
  pendingCount: number
}

export function shortAddress(addr: string) {
  return addr.slice(0, 6) + "…" + addr.slice(-4)
}

/**
 * 公開ループフィード。ウォレット接続なしで見られることが要件。
 *
 * 表示名は userProfiles.displayName → providers.name → 短縮アドレス の順で解決する。
 * 名前を登録していない人が実名で載ることはない。
 */
export async function getLoopFeed(limit = 20): Promise<LoopItem[]> {
  // 全チェーン・全ノードを読むと件数が増えたときに破綻するため、
  // 新しいチェーンから limit の3倍だけ取って、その範囲のノードだけを読む。
  // 「古いチェーンに久しぶりの動きがあった」場合は取りこぼすが、
  // フィードの目的（いま動いているものを見せる）には影響しない。
  const allChains = await db
    .select()
    .from(chains)
    .orderBy(desc(chains.id))
    .limit(Math.max(limit * 3, 30))
  if (allChains.length === 0) return []

  const chainIds = allChains.map((c) => c.id)
  const allNodes = await db.select().from(chainNodes).where(inArray(chainNodes.chainId, chainIds))

  const wallets = [
    ...new Set([
      ...allChains.map((c) => c.originWallet),
      ...allNodes.flatMap((n) => [n.giverWallet, n.receiverWallet]),
    ].map((w) => w.toLowerCase())),
  ]

  const [profileRows, providerRows] = await Promise.all([
    wallets.length ? db.select().from(userProfiles).where(inArray(userProfiles.walletAddress, wallets)) : [],
    wallets.length ? db.select().from(providers).where(inArray(providers.walletAddress, wallets)) : [],
  ])

  const nameMap = new Map<string, string>()
  for (const p of providerRows) if (p.name) nameMap.set(p.walletAddress.toLowerCase(), p.name)
  for (const p of profileRows) if (p.displayName) nameMap.set(p.walletAddress.toLowerCase(), p.displayName)

  const party = (wallet: string): Party => {
    const key = wallet.toLowerCase()
    const name = nameMap.get(key)
    return { wallet, name: name ?? shortAddress(wallet), named: Boolean(name) }
  }

  const items: LoopItem[] = allChains.map((chain) => {
    const nodes = allNodes
      .filter((n) => n.chainId === chain.id)
      .sort((a, b) => a.position - b.position)
    const confirmed = nodes.filter((n) => n.status === "confirmed")

    // 報酬計算と同じ数え方に揃える（重複除去した参加者の数がステージを決める）
    const participantWallets = [chain.originWallet, ...confirmed.map((n) => n.receiverWallet)]
      .filter((w, i, arr) => arr.findIndex((x) => x.toLowerCase() === w.toLowerCase()) === i)

    const isLoop =
      nodes.length >= 5 &&
      nodes[nodes.length - 1]?.receiverWallet.toLowerCase() === chain.originWallet.toLowerCase()

    const times = confirmed.map((n) => n.confirmedAt ?? n.createdAt).filter(Boolean) as Date[]
    const lastAt = times.length
      ? new Date(Math.max(...times.map((d) => new Date(d).getTime())))
      : chain.createdAt

    return {
      chainId: chain.id,
      length: participantWallets.length,
      stageId: getStage(participantWallets.length).id,
      isLoop,
      startedAt: new Date(chain.createdAt).toISOString(),
      lastAt: new Date(lastAt).toISOString(),
      participants: participantWallets.map(party),
      hops: confirmed
        .slice()
        .reverse()
        .slice(0, 3)
        .map((n) => ({
          position: n.position,
          giver: party(n.giverWallet),
          receiver: party(n.receiverWallet),
          description: n.description,
          at: n.confirmedAt ? new Date(n.confirmedAt).toISOString() : null,
        })),
      pendingCount: nodes.length - confirmed.length,
    }
  })

  // 動きがあったものから見せる。ループ完成は最上位に持ち上げる
  return items
    .filter((i) => i.participants.length > 1 || i.hops.length > 0)
    .sort((a, b) => {
      if (a.isLoop !== b.isLoop) return a.isLoop ? -1 : 1
      return new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime()
    })
    .slice(0, limit)
}
