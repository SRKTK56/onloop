import { NextRequest, NextResponse } from "next/server"

function buildPrompt(title: string, description: string): string {
  const base = [title, description.slice(0, 120)].filter(Boolean).join(". ")
  return (
    `A warm and friendly illustration for a pay-it-forward community service: ${base}. ` +
    "Soft blue and warm tones, kind and welcoming atmosphere, clean digital art style, " +
    "no text, no faces, symbolic and abstract, suitable for a service card image"
  )
}

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json()

    if (!title) {
      return NextResponse.json({ error: "タイトルは必須です" }, { status: 400 })
    }

    const apiKey = process.env.LIGHTHOUSE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Lighthouse APIキーが設定されていません" }, { status: 500 })
    }

    // ── 1. Pollinations.ai で画像生成 ─────────────────────────────
    const prompt   = buildPrompt(title, description ?? "")
    const encoded  = encodeURIComponent(prompt)
    const seed     = Math.floor(Math.random() * 9999)
    const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&nologo=true&seed=${seed}`

    const imageRes = await fetch(imageUrl, { signal: AbortSignal.timeout(30_000) })
    if (!imageRes.ok) {
      return NextResponse.json({ error: "画像生成に失敗しました" }, { status: 502 })
    }
    const imageBuffer = await imageRes.arrayBuffer()

    // ── 2. Lighthouse にアップロード ──────────────────────────────
    const form = new FormData()
    form.append(
      "file",
      new Blob([imageBuffer], { type: "image/jpeg" }),
      `onloop-menu-${Date.now()}.jpg`,
    )

    const lhRes = await fetch("https://node.lighthouse.storage/api/v0/add", {
      method:  "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body:    form,
    })

    if (!lhRes.ok) {
      const errText = await lhRes.text()
      console.error("[generate-image] Lighthouse error:", errText)
      return NextResponse.json({ error: "Lighthouseへのアップロードに失敗しました" }, { status: 502 })
    }

    const lhData = await lhRes.json()
    const cid    = lhData.Hash
    const url    = `https://gateway.lighthouse.storage/ipfs/${cid}`

    return NextResponse.json({ url, cid })
  } catch (err) {
    console.error("[generate-image] error:", err)
    return NextResponse.json({ error: "画像生成中にエラーが発生しました" }, { status: 500 })
  }
}
