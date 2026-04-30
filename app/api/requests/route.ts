import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { serviceRequests } from "@/lib/db/schema"

export async function POST(req: NextRequest) {
  try {
    const { description, email } = await req.json()

    if (!description) {
      return NextResponse.json({ error: "説明が必要です" }, { status: 400 })
    }

    await db.insert(serviceRequests).values({
      requesterEmail: email || null,
      description,
      status: "open",
    })

    console.log(`[requests] New service request: ${description.slice(0, 50)}`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[requests] POST error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
