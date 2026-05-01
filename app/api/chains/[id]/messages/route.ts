import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { chainMessages, chainNodes } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"

type Params = { params: Promise<{ id: string }> }

// メッセージ一覧取得
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const nodeId = parseInt(id)
    const messages = await db
      .select()
      .from(chainMessages)
      .where(eq(chainMessages.nodeId, nodeId))
      .orderBy(asc(chainMessages.createdAt))
    return NextResponse.json(messages)
  } catch (err) {
    console.error("[messages] GET error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// メッセージ送信
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const nodeId = parseInt(id)
    const { senderWallet, message } = await req.json()

    if (!senderWallet || !message?.trim()) {
      return NextResponse.json({ error: "入力が不足しています" }, { status: 400 })
    }

    // 送信者がノードのgiver or receiverであることを確認
    const [node] = await db.select().from(chainNodes).where(eq(chainNodes.id, nodeId))
    if (!node) return NextResponse.json({ error: "ノードが見つかりません" }, { status: 404 })

    const isParticipant =
      node.giverWallet.toLowerCase() === senderWallet.toLowerCase() ||
      node.receiverWallet.toLowerCase() === senderWallet.toLowerCase()

    if (!isParticipant) {
      return NextResponse.json({ error: "このチェーンの参加者ではありません" }, { status: 403 })
    }

    const [msg] = await db
      .insert(chainMessages)
      .values({ nodeId, senderWallet, message: message.trim() })
      .returning()

    return NextResponse.json(msg)
  } catch (err) {
    console.error("[messages] POST error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
