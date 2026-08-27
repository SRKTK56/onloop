import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { providers, userProfiles } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const chainIdParam = searchParams.get("chainId")
    if (!chainIdParam) return NextResponse.json({ error: "chainId required" }, { status: 400 })

    const chainId = parseInt(chainIdParam)
    if (isNaN(chainId)) return NextResponse.json({ error: "invalid chainId" }, { status: 400 })

    const rows = await db
      .select({
        id: providers.id,
        walletAddress: providers.walletAddress,
        name: providers.name,
        role: providers.role,
        chainId: providers.chainId,
        serviceTitle: providers.serviceTitle,
        profileAvatarUrl: userProfiles.avatarUrl,
      })
      .from(providers)
      .leftJoin(userProfiles, eq(providers.walletAddress, userProfiles.walletAddress))
      .where(and(eq(providers.chainId, chainId), eq(providers.status, "approved")))
      .orderBy(providers.id)

    return NextResponse.json(rows)
  } catch (err) {
    console.error("[chain-members] GET error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
