import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { userProfiles, onBalances, onTransactions, chainNodes, chains } from "@/lib/db/schema"
import { eq, or, desc } from "drizzle-orm"

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

    return NextResponse.json({
      profile: profile ?? null,
      balance: balance?.balance ?? 0,
      history,
      originChains,
      nodes,
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
