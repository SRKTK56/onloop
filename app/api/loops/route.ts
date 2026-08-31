import { NextRequest, NextResponse } from "next/server"
import { getLoopFeed } from "@/lib/loops"

export const dynamic = "force-dynamic"

/** 公開ループフィード。認証なしで誰でも読める（これが要件） */
export async function GET(req: NextRequest) {
  const limit = Number(new URL(req.url).searchParams.get("limit") ?? 20)
  try {
    const items = await getLoopFeed(Math.min(Math.max(limit, 1), 50))
    return NextResponse.json(
      { items },
      // 「ライブ」だが秒単位の鮮度は要らない。LPからの連打でDBを叩かないよう短くキャッシュする
      { headers: { "Cache-Control": "public, s-maxage=20, stale-while-revalidate=60" } }
    )
  } catch (err) {
    console.error("[loops] failed:", err)
    return NextResponse.json({ error: "フィードの取得に失敗しました" }, { status: 500 })
  }
}
