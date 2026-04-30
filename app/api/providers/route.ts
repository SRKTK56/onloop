import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { providers } from "@/lib/db/schema"

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
