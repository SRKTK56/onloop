/**
 * 画像未設定のプロバイダーにメニュー内容に合わせた画像を付与するスクリプト
 * SVGを生成してLighthouseにアップロード後、DBのavatarUrlを更新する
 * 実行: npx dotenv-cli -e .env.local -- npx tsx scripts/seed-images.ts
 */
import { neon }    from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { eq, isNull, or } from "drizzle-orm"
import * as schema from "../lib/db/schema"

const sql = neon(process.env.DATABASE_URL!)
const db  = drizzle(sql, { schema })

const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY!
if (!LIGHTHOUSE_API_KEY) {
  console.error("❌ LIGHTHOUSE_API_KEY が設定されていません")
  process.exit(1)
}

// ── サービスキーワード → 絵文字・配色マッピング ─────────────────────────
const SERVICE_THEMES: { keywords: string[]; emoji: string; bg1: string; bg2: string; accent: string }[] = [
  { keywords: ["写真","カメラ","撮影","フォト"], emoji: "📸", bg1: "#0a1628", bg2: "#1a3a6a", accent: "#4d8cff" },
  { keywords: ["料理","食事","おもてなし","クッキング","レシピ"], emoji: "🍳", bg1: "#1a0a08", bg2: "#4a1a10", accent: "#ff8c4d" },
  { keywords: ["ビジネス","事業","アイデア","コンサル","経営"], emoji: "💡", bg1: "#0a1020", bg2: "#1a2a50", accent: "#ffd700" },
  { keywords: ["デザイン","ロゴ","バナー","グラフィック","UI"], emoji: "🎨", bg1: "#120a1a", bg2: "#2a1a4a", accent: "#c084fc" },
  { keywords: ["キャリア","転職","就職","仕事","採用"], emoji: "🚀", bg1: "#0a0a1a", bg2: "#0a1a3a", accent: "#0052ff" },
  { keywords: ["音楽","ギター","ピアノ","楽器","DTM","レッスン"], emoji: "🎵", bg1: "#0a0a1a", bg2: "#1a0a2a", accent: "#a855f7" },
  { keywords: ["英語","語学","英会話","プレゼン","TOEIC"], emoji: "🌍", bg1: "#0a1410", bg2: "#0a2a1a", accent: "#22c55e" },
  { keywords: ["トレーニング","フィットネス","筋トレ","ダイエット","スポーツ"], emoji: "💪", bg1: "#1a0808", bg2: "#3a1010", accent: "#ef4444" },
  { keywords: ["旅行","トラベル","観光","プランニング","ルート"], emoji: "✈️", bg1: "#0a1020", bg2: "#0a2040", accent: "#38bdf8" },
  { keywords: ["プログラミング","コード","エンジニア","開発","技術"], emoji: "💻", bg1: "#080a10", bg2: "#101828", accent: "#4ade80" },
  { keywords: ["教育","学習","勉強","指導","サポート"], emoji: "📚", bg1: "#0a100a", bg2: "#1a2a14", accent: "#84cc16" },
  { keywords: ["マーケティング","SNS","広報","集客"], emoji: "📊", bg1: "#100a10", bg2: "#281428", accent: "#e879f9" },
]

function detectTheme(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase()
  for (const theme of SERVICE_THEMES) {
    if (theme.keywords.some(kw => text.includes(kw))) return theme
  }
  // デフォルト
  return { emoji: "🤝", bg1: "#0a0a1a", bg2: "#0a1a3a", accent: "#0052ff" }
}

function makeSvg(title: string, description: string): string {
  const theme = detectTheme(title, description)
  const shortTitle = title.length > 18 ? title.slice(0, 16) + "…" : title

  // タイトルを2行に分割（日本語対応）
  const words = shortTitle.split(/[\s・、]/g).filter(Boolean)
  let line1 = "", line2 = ""
  for (const w of words) {
    if ((line1 + w).length <= 9) line1 += (line1 ? " " : "") + w
    else { line2 += (line2 ? " " : "") + w }
  }
  if (!line2 && line1.length > 9) {
    line2 = line1.slice(9)
    line1 = line1.slice(0, 9)
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg1}"/>
      <stop offset="100%" stop-color="${theme.bg2}"/>
    </linearGradient>
    <linearGradient id="circle" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0.05"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" fill="url(#bg)"/>

  <!-- Decorative circles -->
  <circle cx="420" cy="80"  r="140" fill="${theme.accent}" fill-opacity="0.06"/>
  <circle cx="80"  cy="420" r="120" fill="${theme.accent}" fill-opacity="0.06"/>
  <circle cx="256" cy="256" r="160" fill="url(#circle)"/>

  <!-- Grid dots -->
  ${Array.from({ length: 6 }, (_, row) =>
    Array.from({ length: 6 }, (_, col) =>
      `<circle cx="${64 + col * 80}" cy="${64 + row * 80}" r="1.5" fill="${theme.accent}" fill-opacity="0.2"/>`
    ).join("")
  ).join("")}

  <!-- Accent border lines -->
  <line x1="40" y1="40"  x2="472" y2="40"  stroke="${theme.accent}" stroke-width="1" stroke-opacity="0.2"/>
  <line x1="40" y1="472" x2="472" y2="472" stroke="${theme.accent}" stroke-width="1" stroke-opacity="0.2"/>
  <line x1="40" y1="40"  x2="40"  y2="472" stroke="${theme.accent}" stroke-width="1" stroke-opacity="0.2"/>
  <line x1="472" y1="40" x2="472" y2="472" stroke="${theme.accent}" stroke-width="1" stroke-opacity="0.2"/>

  <!-- Corner accents -->
  <line x1="40" y1="40" x2="80"  y2="40"  stroke="${theme.accent}" stroke-width="2" stroke-opacity="0.8"/>
  <line x1="40" y1="40" x2="40"  y2="80"  stroke="${theme.accent}" stroke-width="2" stroke-opacity="0.8"/>
  <line x1="472" y1="40"  x2="432" y2="40"  stroke="${theme.accent}" stroke-width="2" stroke-opacity="0.8"/>
  <line x1="472" y1="40"  x2="472" y2="80"  stroke="${theme.accent}" stroke-width="2" stroke-opacity="0.8"/>
  <line x1="40" y1="472"  x2="80"  y2="472" stroke="${theme.accent}" stroke-width="2" stroke-opacity="0.8"/>
  <line x1="40" y1="472"  x2="40"  y2="432" stroke="${theme.accent}" stroke-width="2" stroke-opacity="0.8"/>

  <!-- Emoji (large, centered-top) -->
  <text x="256" y="230" font-size="120" text-anchor="middle" dominant-baseline="middle">${theme.emoji}</text>

  <!-- ONLOOP label -->
  <text x="256" y="330" font-size="14" text-anchor="middle" fill="${theme.accent}" fill-opacity="0.7"
        font-family="monospace" letter-spacing="6">ONLOOP MENU</text>

  <!-- Divider -->
  <line x1="156" y1="348" x2="356" y2="348" stroke="${theme.accent}" stroke-width="1" stroke-opacity="0.4"/>

  <!-- Title -->
  <text x="256" y="382" font-size="22" text-anchor="middle" fill="#e0e8ff" fill-opacity="0.9"
        font-family="sans-serif" font-weight="bold">${line1}</text>
  ${line2 ? `<text x="256" y="412" font-size="20" text-anchor="middle" fill="#e0e8ff" fill-opacity="0.7"
        font-family="sans-serif">${line2}</text>` : ""}
</svg>`
}

async function uploadToLighthouse(svgContent: string, filename: string): Promise<string> {
  const blob = new Blob([svgContent], { type: "image/svg+xml" })
  const form = new FormData()
  form.append("file", blob, filename)

  const res = await fetch("https://node.lighthouse.storage/api/v0/add", {
    method:  "POST",
    headers: { Authorization: `Bearer ${LIGHTHOUSE_API_KEY}` },
    body:    form,
  })
  if (!res.ok) throw new Error(`Lighthouse失敗: ${await res.text()}`)

  const data = await res.json()
  return `https://gateway.lighthouse.storage/ipfs/${data.Hash}`
}

async function run() {
  console.log("🎨 画像未設定メニューへのSVG画像生成・アップロードを開始...\n")

  const targets = await db
    .select()
    .from(schema.providers)
    .where(or(isNull(schema.providers.avatarUrl), eq(schema.providers.avatarUrl, "")))

  if (targets.length === 0) {
    console.log("✅ 画像未設定のメニューはありません")
    process.exit(0)
  }

  console.log(`対象: ${targets.length} 件\n`)
  let success = 0, failed = 0

  for (const provider of targets) {
    process.stdout.write(`  [${provider.id}] ${provider.name} — "${provider.serviceTitle}" ... `)
    try {
      const svg      = makeSvg(provider.serviceTitle, provider.serviceDescription)
      const filename = `menu-${provider.id}-${Date.now()}.svg`
      const url      = await uploadToLighthouse(svg, filename)

      await db
        .update(schema.providers)
        .set({ avatarUrl: url })
        .where(eq(schema.providers.id, provider.id))

      console.log(`✓`)
      console.log(`       ${url}`)
      success++
    } catch (err: any) {
      console.log(`✗ ${err.message}`)
      failed++
    }
  }

  console.log(`\n✅ 完了 — 成功: ${success} / 失敗: ${failed}`)
  process.exit(0)
}

run().catch(err => {
  console.error("❌ エラー:", err)
  process.exit(1)
})
