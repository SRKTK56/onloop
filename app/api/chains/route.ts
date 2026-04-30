import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { chains, chainNodes, onBalances, onTransactions } from "@/lib/db/schema"
import { eq, and, sql } from "drizzle-orm"
import { calcHopRewards } from "@/lib/rewards"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const wallet = searchParams.get("wallet")

  if (wallet) {
    const nodes = await db
      .select()
      .from(chainNodes)
      .where(
        and(
          eq(chainNodes.giverWallet, wallet),
        )
      )
    return NextResponse.json(nodes)
  }

  const allChains = await db.select().from(chains)
  return NextResponse.json(allChains)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { giverWallet, receiverWallet, description, chainId } = body

    if (!giverWallet || !receiverWallet || !description) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 })
    }

    let targetChainId = chainId

    // 新規チェーンの場合
    if (!targetChainId) {
      const [newChain] = await db
        .insert(chains)
        .values({ originWallet: giverWallet })
        .returning()
      targetChainId = newChain.id
    }

    // 現在のチェーンのノードを取得して position を決定
    const existingNodes = await db
      .select()
      .from(chainNodes)
      .where(eq(chainNodes.chainId, targetChainId))

    const position = existingNodes.length

    const [node] = await db
      .insert(chainNodes)
      .values({
        chainId: targetChainId,
        position,
        giverWallet,
        receiverWallet,
        description,
        status: "pending",
      })
      .returning()

    // 報酬計算（ノードが確認済みになったタイミングで行うが、作成時にプレビュー）
    const participants = [
      ...existingNodes.map((n) => n.giverWallet),
      giverWallet,
    ].filter((w, i, arr) => arr.indexOf(w) === i)

    console.log(`[chains] New node created: chain=${targetChainId} pos=${position} giver=${giverWallet}`)

    return NextResponse.json({ node, chainId: targetChainId, previewParticipants: participants })
  } catch (err) {
    console.error("[chains] POST error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { nodeId, receiverWallet } = body

    if (!nodeId || !receiverWallet) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 })
    }

    // ノードを確認済みに更新
    const [node] = await db
      .update(chainNodes)
      .set({ status: "confirmed", confirmedAt: new Date() })
      .where(and(eq(chainNodes.id, nodeId), eq(chainNodes.receiverWallet, receiverWallet)))
      .returning()

    if (!node) {
      return NextResponse.json({ error: "ノードが見つかりません" }, { status: 404 })
    }

    // チェーン上の全ノードを取得して報酬計算
    const allNodes = await db
      .select()
      .from(chainNodes)
      .where(eq(chainNodes.chainId, node.chainId))

    const chain = await db
      .select()
      .from(chains)
      .where(eq(chains.id, node.chainId))

    const originWallet = chain[0]?.originWallet ?? node.giverWallet
    const confirmedNodes = allNodes.filter((n) => n.status === "confirmed")
    const participants = [originWallet, ...confirmedNodes.map((n) => n.receiverWallet)].filter(
      (w, i, arr) => arr.indexOf(w) === i
    )

    const rewards = calcHopRewards(participants.slice(0, -1), node.receiverWallet)

    // 報酬を付与
    for (const [wallet, amount] of Object.entries(rewards)) {
      await db
        .insert(onBalances)
        .values({ walletAddress: wallet, balance: amount, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: onBalances.walletAddress,
          set: {
            balance: sql`${onBalances.balance} + ${amount}`,
            updatedAt: new Date(),
          },
        })

      await db.insert(onTransactions).values({
        walletAddress: wallet,
        amount,
        reason: `chain_hop chain=${node.chainId}`,
        chainId: node.chainId,
      })
    }

    console.log(`[chains] Node confirmed: id=${nodeId}, rewards distributed`)

    return NextResponse.json({ node, rewards })
  } catch (err) {
    console.error("[chains] PATCH error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
