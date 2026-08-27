/**
 * ONLOOP デモ動画用スクリーンショット自動取得
 * 実際のサービス画面をナレーションに合わせてキャプチャ
 */
import { chromium } from "playwright-chromium"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { mkdirSync } from "fs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, "video/tmp/screens")
const BASE_URL = "https://onloop-one.vercel.app"
const W = 1280, H = 720
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const ctx     = await browser.newContext({ viewport: { width: W, height: H } })
const page    = await ctx.newPage()

async function shot(name, fn) {
  console.log(`  📸 ${name}`)
  try {
    await fn()
    await page.waitForTimeout(1500)
    await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: false })
  } catch (e) {
    console.log(`     ⚠️  スキップ (${e.message.slice(0,60)})`)
  }
}

async function goto(url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 })
  await page.waitForTimeout(2000)
}

console.log("🌐 スクリーンショット取得中 (English mode)...\n")

// ── 英語に切り替え（localStorage経由）───────────────────
await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 45000 })
await page.evaluate(() => localStorage.setItem("onloop_lang", "en"))
await page.waitForTimeout(500)

// ── Scene 1: LP ヒーロー ─────────────────────────────────
await shot("s1_hero", async () => {
  await goto(BASE_URL)
  await page.waitForTimeout(500) // 言語適用を待つ
  await page.evaluate(() => window.scrollTo(0, 0))
})

// ── Scene 2a: LP HOW IT WORKS ─────────────────────────────
await shot("s2a_how", async () => {
  await page.evaluate(() => {
    const sections = document.querySelectorAll("section")
    sections[1]?.scrollIntoView({ behavior: "instant" })
  })
})

// ── Scene 2b: LP ON TOKEN セクション ──────────────────────
await shot("s2b_ontoken", async () => {
  await page.evaluate(() => {
    const sections = document.querySelectorAll("section")
    sections[2]?.scrollIntoView({ behavior: "instant" })
  })
})

// ── Scene 3: 恩送りメニュー ────────────────────────────────
await shot("s3_menu", async () => {
  await goto(`${BASE_URL}/menu`)
  await page.evaluate(() => window.scrollTo(0, 0))
})

// ── Scene 3b: メニューカード詳細（クリック）────────────────
await shot("s3b_menu_modal", async () => {
  const cards = await page.$$(".pixel-box")
  if (cards.length > 0) {
    await cards[0].click()
    await page.waitForTimeout(1000)
  }
})

// ── Scene 4a: LP NFT セクション ───────────────────────────
await shot("s4a_nft_lp", async () => {
  await goto(BASE_URL)
  await page.evaluate(() => {
    const sections = document.querySelectorAll("section")
    sections[3]?.scrollIntoView({ behavior: "instant" })
  })
})

// ── Scene 4b: LP WORLD STAGES ─────────────────────────────
await shot("s4b_stages", async () => {
  await page.evaluate(() => {
    const sections = document.querySelectorAll("section")
    sections[4]?.scrollIntoView({ behavior: "instant" })
  })
})

// ── Scene 5: NFT MINTページ ───────────────────────────────
await shot("s5_mint", async () => {
  await goto(`${BASE_URL}/mint`)
  await page.evaluate(() => window.scrollTo(0, 0))
})

// ── Scene 5b: MINTページ下部（レアリティ表）─────────────
await shot("s5b_mint_rarity", async () => {
  await page.evaluate(() => window.scrollTo(0, 420))
})

// ── Scene 6: LP 最下部 CTA ────────────────────────────────
await shot("s6_cta", async () => {
  await goto(BASE_URL)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
})

// ── Scene 6b: Basescan コントラクト ──────────────────────
await shot("s6b_basescan", async () => {
  await page.goto(
    "https://basescan.org/address/0x568db29ef6999e9c2815cbf2d103ebb26d0a9a71",
    { waitUntil: "domcontentloaded", timeout: 30000 }
  )
  await page.waitForTimeout(2000)
})

await browser.close()

console.log(`\n✅ スクリーンショット完了 → grants/video/tmp/screens/`)
console.log("   取得画面一覧:")
const files = ["s1_hero","s2a_how","s2b_ontoken","s3_menu","s3b_menu_modal",
               "s4a_nft_lp","s4b_stages","s5_mint","s5b_mint_rarity","s6_cta","s6b_basescan"]
files.forEach(f => console.log(`   - ${f}.png`))
