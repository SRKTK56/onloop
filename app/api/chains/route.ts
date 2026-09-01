import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { chains, chainNodes, onBalances, onTransactions, providers } from "@/lib/db/schema"
import { eq, and, sql } from "drizzle-orm"
import { calcHopRewards, calcLoopRewards } from "@/lib/rewards"
import { getStage } from "@/lib/stages"
import { mintBatch } from "@/lib/web3/ontoken"
import { recordNodeOnChain, confirmNodeOnChain } from "@/lib/web3/onchain"

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
    const { giverWallet, receiverWallet, description, chainId, startNewChain } = body

    if (!giverWallet || !receiverWallet || !description) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 })
    }

    let targetChainId: number | null = chainId ?? null

    // 明示指定が無ければ、贈り手が「中継者」として紐づけた輪を引き継ぐ。
    // ここが無いと、誰が恩送りをしても必ず新しい輪ができて既存の輪が伸びない
    // （2026-08-31 まで実際にそうなっていた）。
    if (!targetChainId && !startNewChain) {
      const [asRelay] = await db
        .select({ chainId: providers.chainId })
        .from(providers)
        .where(and(eq(providers.walletAddress, giverWallet), eq(providers.status, "approved")))
      if (asRelay?.chainId) targetChainId = asRelay.chainId
    }

    // 指定された輪が実在するか確認する（消えた輪に繋ごうとしたら新規に倒す）
    if (targetChainId) {
      const [exists] = await db.select({ id: chains.id }).from(chains).where(eq(chains.id, targetChainId))
      if (!exists) targetChainId = null
    }

    // 新規チェーンの場合。起点者＝最初に与えた人
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

    // 恩送りノードの作成をオンチェーンに記録（非同期・失敗してもレスポンス影響なし）
    recordNodeOnChain({
      chainId:      targetChainId,
      originWallet: giverWallet,
      position,
      giver:        giverWallet,
      receiver:     receiverWallet,
      description,
    }).catch((err) => console.error("[chains] recordNodeOnChain error:", err))

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

    // ── 連鎖1ホップぶんの報酬 ─────────────────────────────────
    const rewards = calcHopRewards(participants.slice(0, -1), node.receiverWallet, node.giverWallet)

    // 報酬をDBに付与
    for (const [wallet, amount] of Object.entries(rewards)) {
      await db
        .insert(onBalances)
        .values({ walletAddress: wallet, balance: amount, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: onBalances.walletAddress,
          set: { balance: sql`${onBalances.balance} + ${amount}`, updatedAt: new Date() },
        })
      await db.insert(onTransactions).values({
        walletAddress: wallet,
        amount,
        reason: `chain_hop chain=${node.chainId}`,
        chainId: node.chainId,
      })
    }

    // ── ループ判定 ────────────────────────────────────────────
    const isLoop = allNodes.length >= 5 &&
      allNodes[allNodes.length - 1]?.receiverWallet === originWallet

    // ── ループボーナス（連鎖の長さ＝ステージ倍率で全員を増幅）────
    // 「輪が長く続くほど、閉じたときの報いが大きい」がこのプロダクトの中核。
    let loopRewards: Record<string, number> = {}
    let loopStage = getStage(participants.length)
    if (isLoop) {
      loopStage   = getStage(participants.length)
      loopRewards = calcLoopRewards(participants, loopStage.loopMultiplier)

      for (const [wallet, amount] of Object.entries(loopRewards)) {
        await db
          .insert(onBalances)
          .values({ walletAddress: wallet, balance: amount, updatedAt: new Date() })
          .onConflictDoUpdate({
            target: onBalances.walletAddress,
            set: { balance: sql`${onBalances.balance} + ${amount}`, updatedAt: new Date() },
          })
        await db.insert(onTransactions).values({
          walletAddress: wallet,
          amount,
          reason: `loop_complete chain=${node.chainId} stage=${loopStage.id} mult=${loopStage.loopMultiplier}`,
          chainId: node.chainId,
        })
      }
      console.log(`[chains] Loop complete! stage=${loopStage.nameEn} mult=×${loopStage.loopMultiplier}`)
    }

    console.log(`[chains] Node confirmed: id=${nodeId}, chain_length=${participants.length}`)

    // オンチェーン記録 + Mint（非同期・失敗してもレスポンス影響なし）
    const allRewards = { ...rewards }
    for (const [w, v] of Object.entries(loopRewards)) {
      allRewards[w] = (allRewards[w] ?? 0) + v
    }
    Promise.all([
      confirmNodeOnChain({ chainId: node.chainId, position: node.position, isLoop }),
      mintBatch(allRewards),
    ]).catch((err) => console.error("[chains] onchain error:", err))

    return NextResponse.json({ node, rewards, loopRewards, isLoop, stage: loopStage.id })
  } catch (err) {
    console.error("[chains] PATCH error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
