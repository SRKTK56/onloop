import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { providers } from "@/lib/db/schema"
import { eq, isNull, or } from "drizzle-orm"

export const dynamic = "force-dynamic"

// GET: 画像未設定のプロバイダー一覧を返す
export async function GET() {
  const targets = await db
    .select({ id: providers.id, name: providers.name, serviceTitle: providers.serviceTitle })
    .from(providers)
    .where(or(isNull(providers.avatarUrl), eq(providers.avatarUrl, "")))

  return NextResponse.json({ targets, count: targets.length })
}

// POST: 指定プロバイダーの画像を生成してDBを更新
export async function POST(req: NextRequest) {
  const { providerId } = await req.json()

  const [provider] = await db
    .select()
    .from(providers)
    .where(eq(providers.id, providerId))

  if (!provider) {
    return NextResponse.json({ error: "プロバイダーが見つかりません" }, { status: 404 })
  }

  const apiKey = process.env.LIGHTHOUSE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "Lighthouse APIキー未設定" }, { status: 500 })
  }

  // ── SVG生成 ────────────────────────────────────────────────────────────
  const SERVICE_THEMES = [
    { keywords: ["写真","カメラ","撮影","フォト"], emoji: "📸", bg1: "#0a1628", bg2: "#1a3a6a", accent: "#4d8cff" },
    { keywords: ["料理","食事","おもてなし","クッキング"], emoji: "🍳", bg1: "#1a0a08", bg2: "#4a1a10", accent: "#ff8c4d" },
    { keywords: ["ビジネス","事業","アイデア","コンサル","経営","壁打ち"], emoji: "💡", bg1: "#0a1020", bg2: "#1a2a50", accent: "#ffd700" },
    { keywords: ["デザイン","ロゴ","バナー","グラフィック"], emoji: "🎨", bg1: "#120a1a", bg2: "#2a1a4a", accent: "#c084fc" },
    { keywords: ["キャリア","転職","就職","仕事","採用"], emoji: "🚀", bg1: "#0a0a1a", bg2: "#0a1a3a", accent: "#0052ff" },
    { keywords: ["音楽","ギター","ピアノ","楽器","DTM"], emoji: "🎵", bg1: "#0a0a1a", bg2: "#1a0a2a", accent: "#a855f7" },
    { keywords: ["英語","語学","英会話","プレゼン"], emoji: "🌍", bg1: "#0a1410", bg2: "#0a2a1a", accent: "#22c55e" },
    { keywords: ["トレーニング","フィットネス","筋トレ","ダイエット","スポーツ"], emoji: "💪", bg1: "#1a0808", bg2: "#3a1010", accent: "#ef4444" },
    { keywords: ["旅行","トラベル","観光","プランニング"], emoji: "✈️", bg1: "#0a1020", bg2: "#0a2040", accent: "#38bdf8" },
    { keywords: ["プログラミング","コード","エンジニア","開発"], emoji: "💻", bg1: "#080a10", bg2: "#101828", accent: "#4ade80" },
  ]

  const text = `${provider.serviceTitle} ${provider.serviceDescription}`.toLowerCase()
  const theme = SERVICE_THEMES.find(t => t.keywords.some(kw => text.includes(kw)))
    ?? { emoji: "🤝", bg1: "#0a0a1a", bg2: "#0a1a3a", accent: "#0052ff" }

  const title = provider.serviceTitle
  const short = title.length > 18 ? title.slice(0, 16) + "…" : title
  const mid   = Math.ceil(short.length / 2)
  const line1 = short.slice(0, mid)
  const line2 = short.slice(mid)

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg1}"/>
      <stop offset="100%" stop-color="${theme.bg2}"/>
    </linearGradient>
    <linearGradient id="c" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0.04"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <circle cx="420" cy="80"  r="140" fill="${theme.accent}" fill-opacity="0.07"/>
  <circle cx="80"  cy="420" r="120" fill="${theme.accent}" fill-opacity="0.07"/>
  <circle cx="256" cy="256" r="160" fill="url(#c)"/>
  ${Array.from({length:5},(_,r)=>Array.from({length:5},(_,c)=>
    `<circle cx="${76+c*90}" cy="${76+r*90}" r="1.5" fill="${theme.accent}" fill-opacity="0.18"/>`
  ).join("")).join("")}
  <rect x="40" y="40" width="432" height="432" fill="none" stroke="${theme.accent}" stroke-width="1" stroke-opacity="0.2"/>
  <line x1="40" y1="40" x2="90"  y2="40"  stroke="${theme.accent}" stroke-width="2.5" stroke-opacity="0.9"/>
  <line x1="40" y1="40" x2="40"  y2="90"  stroke="${theme.accent}" stroke-width="2.5" stroke-opacity="0.9"/>
  <line x1="472" y1="40"  x2="422" y2="40"  stroke="${theme.accent}" stroke-width="2.5" stroke-opacity="0.9"/>
  <line x1="472" y1="40"  x2="472" y2="90"  stroke="${theme.accent}" stroke-width="2.5" stroke-opacity="0.9"/>
  <line x1="40"  y1="472" x2="90"  y2="472" stroke="${theme.accent}" stroke-width="2.5" stroke-opacity="0.9"/>
  <line x1="40"  y1="472" x2="40"  y2="422" stroke="${theme.accent}" stroke-width="2.5" stroke-opacity="0.9"/>
  <text x="256" y="228" font-size="130" text-anchor="middle" dominant-baseline="middle">${theme.emoji}</text>
  <text x="256" y="330" font-size="13" text-anchor="middle" fill="${theme.accent}" fill-opacity="0.65"
        font-family="monospace" letter-spacing="7">ONLOOP MENU</text>
  <line x1="140" y1="348" x2="372" y2="348" stroke="${theme.accent}" stroke-width="1" stroke-opacity="0.4"/>
  <text x="256" y="378" font-size="21" text-anchor="middle" fill="#e0e8ff" fill-opacity="0.92"
        font-family="sans-serif" font-weight="bold">${line1}</text>
  ${line2 ? `<text x="256" y="408" font-size="19" text-anchor="middle" fill="#c0d0e8" fill-opacity="0.75"
        font-family="sans-serif">${line2}</text>` : ""}
</svg>`

  // ── Lighthouse アップロード ─────────────────────────────────────────────
  const form = new FormData()
  form.append("file", new Blob([svg], { type: "image/svg+xml" }), `menu-${providerId}.svg`)

  const lhRes = await fetch("https://node.lighthouse.storage/api/v0/add", {
    method:  "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body:    form,
  })
  if (!lhRes.ok) {
    const err = await lhRes.text()
    return NextResponse.json({ error: `Lighthouse失敗: ${err}` }, { status: 502 })
  }

  const lhData  = await lhRes.json()
  const imageUrl = `https://gateway.lighthouse.storage/ipfs/${lhData.Hash}`

  await db
    .update(providers)
    .set({ avatarUrl: imageUrl })
    .where(eq(providers.id, providerId))

  return NextResponse.json({ imageUrl, providerId })
}
