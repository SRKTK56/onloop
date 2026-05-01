import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { providers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const wallet = searchParams.get("wallet")
    if (!wallet) return NextResponse.json({ error: "wallet required" }, { status: 400 })

    const rows = await db.select().from(providers).where(eq(providers.walletAddress, wallet))
    return NextResponse.json(rows)
  } catch (err) {
    console.error("[providers] GET error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { walletAddress, name, avatarUrl, bio, serviceTitle, serviceDescription } = body

  if (!walletAddress || !serviceTitle || !serviceDescription) {
    return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 })
  }

  await db.insert(providers).values({
    walletAddress,
    name: name || null,
    avatarUrl: avatarUrl || null,
    bio: bio || null,
    serviceTitle,
    serviceDescription,
    status: "pending",
  })

  return NextResponse.json({ ok: true })
}
