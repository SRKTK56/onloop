/**
 * ONLOOP NFT → Pinata IPFS アップロード（REST API版）
 * 実行: node scripts/upload-to-ipfs.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import FormData from "form-data"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT      = join(__dirname, "..")
const IMG_DIR   = join(ROOT, "public/nft-full/images")
const META_DIR  = join(ROOT, "public/nft-full/metadata")

const jwt = process.env.PINATA_JWT
if (!jwt) throw new Error("PINATA_JWT が未設定です")

const PIN_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS"

async function pinFolder(dirPath, name) {
  const files = readdirSync(dirPath).sort()
  const form  = new FormData()

  for (const file of files) {
    form.append("file", readFileSync(join(dirPath, file)), {
      filepath:    `${name}/${file}`,
      contentType: file.endsWith(".png") ? "image/png" : "application/json",
    })
  }

  form.append("pinataMetadata", JSON.stringify({ name }))
  form.append("pinataOptions",  JSON.stringify({ wrapWithDirectory: true }))

  const res = await fetch(PIN_URL, {
    method:  "POST",
    headers: { Authorization: `Bearer ${jwt}`, ...form.getHeaders() },
    body:    form.getBuffer(),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Pinata error ${res.status}: ${text}`)
  }

  return (await res.json()).IpfsHash
}

async function main() {
  // ── 認証確認 ──────────────────────────────────────────────
  console.log("🔐 Pinata 認証確認中...")
  const authRes = await fetch("https://api.pinata.cloud/data/testAuthentication", {
    headers: { Authorization: `Bearer ${jwt}` },
  })
  if (!authRes.ok) throw new Error("Pinata 認証失敗。JWTを確認してください")
  console.log("✅ 認証OK\n")

  // ── Step 1: 画像をアップロード ────────────────────────────
  console.log("📦 Step 1: 画像 1,000枚をIPFSへアップロード中...")
  console.log("   (数分かかります...)\n")
  const imagesCID = await pinFolder(IMG_DIR, "ONLOOP-NFT-Images")
  console.log(`✅ 画像アップロード完了！  CID: ${imagesCID}\n`)

  // ── Step 2: メタデータのimage URLを更新 ──────────────────
  console.log("📝 Step 2: メタデータのimage URLを更新中...")
  const metaFiles = readdirSync(META_DIR).filter(f => f.endsWith(".json"))
  for (const file of metaFiles) {
    const path = join(META_DIR, file)
    const meta = JSON.parse(readFileSync(path, "utf-8"))
    const id   = file.replace(".json", "")
    meta.image = `ipfs://${imagesCID}/ONLOOP-NFT-Images/${id}.png`
    writeFileSync(path, JSON.stringify(meta, null, 2))
  }
  console.log(`✅ ${metaFiles.length}件更新完了\n`)

  // ── Step 3: メタデータをアップロード ─────────────────────
  console.log("📦 Step 3: メタデータ 1,000件をIPFSへアップロード中...")
  const metaCID = await pinFolder(META_DIR, "ONLOOP-NFT-Metadata")
  console.log(`✅ メタデータアップロード完了！  CID: ${metaCID}\n`)

  // ── 結果 ──────────────────────────────────────────────────
  const baseURI = `ipfs://${metaCID}/ONLOOP-NFT-Metadata/`
  console.log("========================================")
  console.log("✅ IPFS アップロード完了！")
  console.log("========================================")
  console.log(`\n画像 CID:       ${imagesCID}`)
  console.log(`メタデータ CID: ${metaCID}`)
  console.log(`\nBase URI（コントラクト用）:`)
  console.log(`  ${baseURI}`)
  console.log(`\n確認URL:`)
  console.log(`  https://gateway.pinata.cloud/ipfs/${metaCID}/ONLOOP-NFT-Metadata/0001.json`)
  console.log("\n次のステップ:")
  console.log(`  ! echo "IPFS_METADATA_BASE_URI=${baseURI}" >> .env.local`)
  console.log("========================================\n")
}

main().catch(err => { console.error("❌", err.message); process.exit(1) })
