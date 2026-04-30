import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { chainNodes } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const [node] = await db
      .select()
      .from(chainNodes)
      .where(eq(chainNodes.id, parseInt(id)))

    if (!node) {
      return NextResponse.json({ error: "見つかりません" }, { status: 404 })
    }

    return NextResponse.json(node)
  } catch (err) {
    console.error("[chains/id] GET error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
