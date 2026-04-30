import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { onBalances, onTransactions } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const wallet = searchParams.get("wallet")

    if (!wallet) {
      return NextResponse.json({ error: "wallet パラメータが必要です" }, { status: 400 })
    }

    const [balance] = await db
      .select()
      .from(onBalances)
      .where(eq(onBalances.walletAddress, wallet))

    const history = await db
      .select()
      .from(onTransactions)
      .where(eq(onTransactions.walletAddress, wallet))
      .orderBy(desc(onTransactions.createdAt))
      .limit(20)

    return NextResponse.json({ balance: balance?.balance ?? 0, history })
  } catch (err) {
    console.error("[rewards] GET error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
