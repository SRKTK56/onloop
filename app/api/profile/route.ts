import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { userProfiles, onBalances, onTransactions, chainNodes, chains } from "@/lib/db/schema"
import { eq, or, desc, inArray } from "drizzle-orm"
import { getStage } from "@/lib/stages"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const wallet = searchParams.get("wallet")
    if (!wallet) return NextResponse.json({ error: "wallet required" }, { status: 400 })

    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.walletAddress, wallet))
    const [balance] = await db.select().from(onBalances).where(eq(onBalances.walletAddress, wallet))
    const history = await db
      .select()
      .from(onTransactions)
      .where(eq(onTransactions.walletAddress, wallet))
      .orderBy(desc(onTransactions.createdAt))
      .limit(20)

    // 起点として作ったチェーン
    const originChains = await db.select().from(chains).where(eq(chains.originWallet, wallet))

    // 参加したノード（送受両方）
    const nodes = await db
      .select()
      .from(chainNodes)
      .where(or(eq(chainNodes.giverWallet, wallet), eq(chainNodes.receiverWallet, wallet)))
      .orderBy(desc(chainNodes.createdAt))

    // ── 参加チェーン一覧（ステージ情報付き）──────────────────
    const participatedChainIds = nodes.map((n) => n.chainId)
    const allChainIds = [...new Set([...originChains.map((c) => c.id), ...participatedChainIds])]

    // 起点でないチェーンのレコードも取得
    const nonOriginIds = allChainIds.filter((id) => !originChains.some((c) => c.id === id))
    const otherChains = nonOriginIds.length
      ? await db.select().from(chains).where(inArray(chains.id, nonOriginIds))
      : []
    const allMyChains = [...originChains, ...otherChains]

    // 各チェーンの全ノードを取得してステージ計算
    const allNodesForChains = allChainIds.length
      ? await db.select().from(chainNodes).where(inArray(chainNodes.chainId, allChainIds))
      : []

    const myChains = allMyChains.map((chain) => {
      const chainAllNodes = allNodesForChains.filter((n) => n.chainId === chain.id)
      const confirmedCount = chainAllNodes.filter((n) => n.status === "confirmed").length
      const stage = getStage(confirmedCount)
      const isOrigin = originChains.some((c) => c.id === chain.id)
      const myNode = nodes.find((n) => n.chainId === chain.id)
      const myRole = isOrigin ? "origin"
        : myNode?.giverWallet === wallet ? "giver" : "receiver"

      return {
        id: chain.id,
        originWallet: chain.originWallet,
        createdAt: chain.createdAt,
        myRole,
        totalNodes: chainAllNodes.length,
        confirmedNodes: confirmedCount,
        stage: {
          level: stage.level,
          name: stage.name,
          nameEn: stage.nameEn,
          emoji: stage.emoji,
          accent: stage.accent,
        },
      }
    }).sort((a, b) => b.id - a.id)

    return NextResponse.json({
      profile: profile ?? null,
      balance: balance?.balance ?? 0,
      history,
      originChains,
      nodes,
      myChains,
    })
  } catch (err) {
    console.error("[profile] GET error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, displayName, avatarUrl } = await req.json()
    if (!walletAddress) return NextResponse.json({ error: "wallet required" }, { status: 400 })

    await db
      .insert(userProfiles)
      .values({ walletAddress, displayName: displayName ?? null, avatarUrl: avatarUrl ?? null })
      .onConflictDoUpdate({
        target: userProfiles.walletAddress,
        set: {
          displayName: displayName ?? null,
          avatarUrl: avatarUrl ?? null,
          updatedAt: new Date(),
        },
      })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[profile] POST error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
