/**
 * Base Grant 申請フォーム 自動記入・送信スクリプト
 */
import { chromium } from "playwright-chromium"

const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfXuEzmiAzRhie_z9raFCF1BXweXgVt18o-DvBuRRgyTygL2A/viewform"

const PITCH = `ONLOOP is a pay-it-forward protocol on Base where non-monetary acts of kindness — photography, cooking, mentoring — form verified on-chain chains.

Every confirmed kindness generates real Base transactions via 3 deployed mainnet contracts: ON Token (ERC-20), OnChain (permanent kindness recorder), and OnLoopNFT (500-piece collection).

We are fully Base-native: Coinbase Wallet, Base Names (onloop.base.eth), active on Farcaster (@onloop), and planning Farcaster Frame integration to make kindness-sharing viral on Base.

ONLOOP is live today at onloop-one.vercel.app. Grant funding accelerates our smart contract audit, Farcaster Frames, and Japan market launch — bringing non-crypto users onchain through the act of giving.`

const FIELDS = [
  { label: /email/i,                    value: "shinchi.takahiro24@gmail.com" },
  { label: /nominator name/i,           value: "Shinchi Takahiro" },
  { label: /project name/i,            value: "ONLOOP" },
  { label: /project url/i,             value: "https://onloop-one.vercel.app" },
  { label: /project twitter/i,         value: "" },
  { label: /project farcaster/i,       value: "@onloop" },
  { label: /builder twitter/i,         value: "" },
  { label: /builder farcaster/i,       value: "@onloop" },
  { label: /why does this project/i,   value: PITCH },
  { label: /demo link/i,              value: "https://youtu.be/972dO9cuP6w" },
]

const browser = await chromium.launch({ headless: false, slowMo: 80 })
const page    = await browser.newPage({ viewport: { width: 1280, height: 900 } })

console.log("🌐 フォームを開いています...")
await page.goto(FORM_URL, { waitUntil: "networkidle", timeout: 30000 })
await page.waitForTimeout(2000)

// ── テキスト入力フィールドを埋める ────────────────────────
console.log("✏️  テキストフィールドを記入中...")

// Google Formsの全テキスト入力を取得
const inputs    = await page.$$("input[type='text'], input[type='email'], textarea")
const questions = await page.$$(".freebirdFormviewerComponentsQuestionBaseRoot")

for (const q of questions) {
  const labelEl = await q.$(".freebirdFormviewerComponentsQuestionBaseTitle")
  if (!labelEl) continue
  const labelText = await labelEl.textContent()
  if (!labelText) continue

  const match = FIELDS.find(f => f.label.test(labelText))
  if (!match) continue

  // 対象フィールドの入力欄を探す
  const input = await q.$("input[type='text'], input[type='email'], textarea")
  if (!input) continue

  if (match.value) {
    await input.click()
    await input.fill(match.value)
    console.log(`   ✓ "${labelText.trim().slice(0, 40)}" → "${match.value.slice(0, 50)}"`)
  } else {
    console.log(`   - "${labelText.trim().slice(0, 40)}" → スキップ`)
  }
}

// ── ラジオボタン: Live on Base mainnet ────────────────────
console.log("📻 ラジオボタン: Live on Base mainnet を選択中...")
await page.waitForTimeout(500)

// ラジオボタンを含む選択肢を探す
const radioLabels = await page.$$(".freebirdFormviewerComponentsQuestionRadioChoice")
for (const radio of radioLabels) {
  const text = await radio.textContent()
  if (text && /live on base mainnet/i.test(text)) {
    await radio.click()
    console.log("   ✓ Live on Base mainnet を選択")
    break
  }
}

// ── チェックボックス: メディア利用規約 ────────────────────
console.log("☑️  チェックボックスを選択中...")
await page.waitForTimeout(500)

const checkboxItems = await page.$$(".freebirdFormviewerComponentsQuestionCheckboxChoice")
for (const item of checkboxItems) {
  const text = await item.textContent()
  if (text) {
    await item.click()
    console.log(`   ✓ チェック: "${text.trim().slice(0, 50)}"`)
  }
}

// ── 送信前スクリーンショット ───────────────────────────────
await page.screenshot({ path: "grants/video/tmp/form-before-submit.png", fullPage: true })
console.log("\n📸 送信前スクリーンショットを保存: grants/video/tmp/form-before-submit.png")

// ── 送信ボタンをクリック ──────────────────────────────────
console.log("\n🚀 フォームを送信中...")
await page.waitForTimeout(1000)

const submitBtn = await page.$("[role='button'][jsname='M2UYVd'], .freebirdFormviewerViewItemsItemItemTitle + div [role='button']")
if (submitBtn) {
  await submitBtn.click()
} else {
  // フォールバック: Submitテキストを持つボタン
  await page.getByRole("button", { name: /submit|送信/i }).click()
}

await page.waitForTimeout(3000)

// ── 送信後スクリーンショット ───────────────────────────────
await page.screenshot({ path: "grants/video/tmp/form-submitted.png", fullPage: true })
const url = page.url()
console.log("\n📸 送信後スクリーンショットを保存")
console.log("   現在のURL:", url)

if (url.includes("formResponse") || url.includes("viewform")) {
  const content = await page.textContent("body")
  if (content?.includes("response") || content?.includes("submitted") || content?.includes("Thank") || content?.includes("提出")) {
    console.log("\n✅ フォーム送信完了！")
  } else {
    console.log("\n⚠️  送信状況を確認してください（スクリーンショットを確認）")
  }
}

await page.waitForTimeout(3000)
await browser.close()
