/**
 * デモデータ投入スクリプト
 * 実行: dotenv -e .env.local -- npx tsx scripts/seed-demo.ts
 */
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "../lib/db/schema"

const sql = neon(process.env.DATABASE_URL!)
const db  = drizzle(sql, { schema })

// ── フェイクウォレットアドレス ────────────────────────────────
const WALLETS = {
  eguchi:    "0xA1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A900",
  yamaya:    "0xB2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8b9C011",
  matsushita:"0xC3d4E5f6A7c8D9e0F1a2B3c4D5e6F7a8B9c0D122",
  tanaka:    "0xD4e5F6a7B8d9E0f1A2b3C4d5E6f7A8b9C0d1E233",
  sato:      "0xE5f6A7b8C9e0F1a2B3c4D5e6F7a8B9c0D1e2F344",
  ito:       "0xF6a7B8c9D0f1A2b3C4d5E6f7A8b9C0d1E2f3A455",
  kimura:    "0xA7b8C9d0E1a2B3c4D5e6F7a8B9c0D1e2F3a4B566",
  hayashi:   "0xB8c9D0e1F2b3C4d5E6f7A8b9C0d1E2f3A4b5C677",
  ota:       "0xC9d0E1f2A3c4D5e6F7a8B9c0D1e2F3a4B5c6D788",
  miyata:    "0xD0e1F2a3B4d5E6f7A8b9C0d1E2f3A4b5C6d7E899",
}

async function seed() {
  console.log("🌱 デモデータ投入開始...\n")

  // ── 1. ユーザープロフィール ──────────────────────────────────
  console.log("── ユーザー作成中...")
  const profiles = [
    { walletAddress: WALLETS.eguchi,    displayName: "えぐちさん" },
    { walletAddress: WALLETS.yamaya,    displayName: "やまやさん" },
    { walletAddress: WALLETS.matsushita,displayName: "まつしたさん" },
    { walletAddress: WALLETS.tanaka,    displayName: "たなかさん" },
    { walletAddress: WALLETS.sato,      displayName: "さとうさん" },
    { walletAddress: WALLETS.ito,       displayName: "いとうさん" },
    { walletAddress: WALLETS.kimura,    displayName: "きむらさん" },
    { walletAddress: WALLETS.hayashi,   displayName: "はやしさん" },
    { walletAddress: WALLETS.ota,       displayName: "おおたさん" },
    { walletAddress: WALLETS.miyata,    displayName: "みやたさん" },
  ]

  for (const p of profiles) {
    await db.insert(schema.userProfiles).values(p).onConflictDoNothing()
    process.stdout.write(`  ✓ ${p.displayName}\n`)
  }

  // ── 2. チェーン作成 ─────────────────────────────────────────
  console.log("\n── チェーン作成中...")

  const [chain1] = await db.insert(schema.chains).values({ originWallet: WALLETS.eguchi    }).returning()
  const [chain2] = await db.insert(schema.chains).values({ originWallet: WALLETS.tanaka    }).returning()
  const [chain3] = await db.insert(schema.chains).values({ originWallet: WALLETS.kimura    }).returning()
  const [chain4] = await db.insert(schema.chains).values({ originWallet: WALLETS.ota       }).returning()
  const [chain5] = await db.insert(schema.chains).values({ originWallet: WALLETS.miyata    }).returning()

  console.log(`  ✓ Chain #${chain1.id}（えぐち起点）`)
  console.log(`  ✓ Chain #${chain2.id}（たなか起点）`)
  console.log(`  ✓ Chain #${chain3.id}（きむら起点）`)
  console.log(`  ✓ Chain #${chain4.id}（おおた起点）`)
  console.log(`  ✓ Chain #${chain5.id}（みやた起点）`)

  // ── 3. チェーンノード（恩送りの記録）─────────────────────────
  console.log("\n── チェーンノード作成中...")

  // Chain1: えぐち→やまや→まつした（3ノード / 村 stage）
  await db.insert(schema.chainNodes).values([
    { chainId: chain1.id, position: 0, giverWallet: WALLETS.eguchi,    receiverWallet: WALLETS.yamaya,     description: "ポートフォリオ用の写真を撮影してあげた",   status: "confirmed" },
    { chainId: chain1.id, position: 1, giverWallet: WALLETS.yamaya,    receiverWallet: WALLETS.matsushita, description: "新規事業のアイデア出しを3時間手伝った",   status: "confirmed" },
    { chainId: chain1.id, position: 2, giverWallet: WALLETS.matsushita,receiverWallet: WALLETS.eguchi,     description: "手料理のランチを振る舞い食事会を開いた", status: "pending"   },
  ])
  console.log(`  ✓ Chain #${chain1.id}: 3ノード追加`)

  // Chain2: たなか→さとう（2ノード / 村 stage）
  await db.insert(schema.chainNodes).values([
    { chainId: chain2.id, position: 0, giverWallet: WALLETS.tanaka, receiverWallet: WALLETS.sato, description: "ロゴとバナーのデザイン相談に乗った",         status: "confirmed" },
    { chainId: chain2.id, position: 1, giverWallet: WALLETS.sato,   receiverWallet: WALLETS.ito,  description: "転職相談・キャリアの壁打ちをしてあげた", status: "pending"   },
  ])
  console.log(`  ✓ Chain #${chain2.id}: 2ノード追加`)

  // Chain3: きむら→はやし（2ノード / 村 stage）
  await db.insert(schema.chainNodes).values([
    { chainId: chain3.id, position: 0, giverWallet: WALLETS.kimura,  receiverWallet: WALLETS.hayashi, description: "ギター初心者に無料レッスンを行った",     status: "confirmed" },
    { chainId: chain3.id, position: 1, giverWallet: WALLETS.hayashi, receiverWallet: WALLETS.kimura,  description: "英語でのプレゼン練習に1時間付き合った", status: "pending"   },
  ])
  console.log(`  ✓ Chain #${chain3.id}: 2ノード追加`)

  // Chain4: おおた（1ノード）
  await db.insert(schema.chainNodes).values([
    { chainId: chain4.id, position: 0, giverWallet: WALLETS.ota, receiverWallet: WALLETS.miyata, description: "自宅で個人トレーニングを無料で指導した", status: "confirmed" },
  ])
  console.log(`  ✓ Chain #${chain4.id}: 1ノード追加`)

  // ── 4. プロバイダー（恩送りメニュー）────────────────────────
  console.log("\n── 恩送りメニュー作成中...")

  const providerData = [
    // ── Chain1 メンバー ──
    {
      walletAddress: WALLETS.eguchi,
      name: "えぐちさん",
      bio: "フリーランスカメラマン。人の表情を引き出すのが得意です。SNS用・プロフィール用・イベント記録などなんでも撮ります。",
      serviceTitle: "写真撮影・ポートフォリオ作成サポート",
      serviceDescription: "あなたの魅力が伝わる写真を撮影します。\n\n・SNSプロフィール用写真（1〜2時間）\n・ポートフォリオ用の作品撮影\n・小イベントの記録撮影\n\n場所は都内近郊であれば伺います。撮影後は当日中にデータをお渡しします。",
      status: "approved",
      role: "origin",
      chainId: chain1.id,
    },
    {
      walletAddress: WALLETS.yamaya,
      name: "やまやさん",
      bio: "元コンサル。スタートアップのアドバイザーをしながら、色んな人の事業づくりを応援しています。",
      serviceTitle: "ビジネスアイデア壁打ち・事業計画サポート",
      serviceDescription: "事業のアイデアを一緒に整理しましょう。\n\n・事業アイデアの整理と深掘り\n・ビジネスモデルの壁打ち\n・競合調査のやり方アドバイス\n\nオンライン（60〜90分）でお話しながら進めます。資料などがあれば事前に送ってもらえると助かります。",
      status: "approved",
      role: "relay",
      chainId: chain1.id,
    },
    {
      walletAddress: WALLETS.matsushita,
      name: "まつしたさん",
      bio: "料理が大好きで週末は友人を呼んでよく料理します。和食・イタリアン・アジア料理が得意です。",
      serviceTitle: "手料理でのおもてなし・料理会の開催",
      serviceDescription: "自宅や場所を借りて、手料理を振る舞います。\n\n・4〜6人規模の食事会\n・テーマを決めた料理会（和食の日、アジア料理の日など）\n・料理を一緒に作るワークショップ形式も可\n\n食材費のみご負担ください（1人1,000〜2,000円程度）。",
      status: "approved",
      role: "relay",
      chainId: chain1.id,
    },

    // ── Chain2 メンバー ──
    {
      walletAddress: WALLETS.tanaka,
      name: "たなかさん",
      bio: "グラフィックデザイナー歴8年。ブランディングからSNS用バナーまで、デザイン全般を担当しています。",
      serviceTitle: "デザイン相談・フィードバック",
      serviceDescription: "作ったデザインへのフィードバックや、これからデザインを作る方向性の相談に乗ります。\n\n・ロゴ・バナー・チラシのフィードバック\n・配色・フォントの選び方アドバイス\n・Canvaなどのツール使い方相談\n\nオンラインで1〜2時間。作成物やイメージ画像を事前に共有してください。",
      status: "approved",
      role: "origin",
      chainId: chain2.id,
    },
    {
      walletAddress: WALLETS.sato,
      name: "さとうさん",
      bio: "HR・採用コンサルタント。転職経験5回の自分の経験と、500人以上の面接経験をもとにキャリア相談に乗っています。",
      serviceTitle: "キャリア相談・転職の壁打ち",
      serviceDescription: "キャリアの悩みを一緒に整理しましょう。\n\n・今の会社に残るか転職するかの相談\n・志望動機・自己PRのブラッシュアップ\n・未経験転職の進め方アドバイス\n\nオンラインで60分。話したいことを事前にメモしておくとスムーズです。",
      status: "approved",
      role: "relay",
      chainId: chain2.id,
    },

    // ── Chain3 メンバー ──
    {
      walletAddress: WALLETS.kimura,
      name: "きむらさん",
      bio: "音楽プロデューサー。ギター・ピアノ・DTMを独学で習得。初心者に音楽の楽しさを伝えたい。",
      serviceTitle: "ギター・ピアノ初心者レッスン",
      serviceDescription: "楽器を始めたい方の最初の一歩を一緒に踏み出します。\n\n・ギター：コードの押さえ方から好きな曲を弾くまで\n・ピアノ：鍵盤の基礎から簡単なメロディまで\n・DTM（作曲）入門相談も可\n\n対面（都内）またはオンラインで60〜90分。楽器は貸出可能（ギターのみ）。",
      status: "approved",
      role: "origin",
      chainId: chain3.id,
    },
    {
      walletAddress: WALLETS.hayashi,
      name: "はやしさん",
      bio: "英語講師。TOEIC975点。日常会話からビジネス英語まで、楽しく実践的に教えます。",
      serviceTitle: "英語会話練習・プレゼン練習サポート",
      serviceDescription: "英語を話す機会を一緒に作りましょう。\n\n・日常英会話の練習（テーマフリートーク）\n・英語プレゼンの練習と発音フィードバック\n・英文メール・ライティング添削\n\nオンラインで60分。レベル不問。初心者歓迎です。",
      status: "approved",
      role: "relay",
      chainId: chain3.id,
    },

    // ── Chain4：おおた（起点者・チェーンあり）──
    {
      walletAddress: WALLETS.ota,
      name: "おおたさん",
      bio: "パーソナルトレーナー歴6年。ダイエット・筋トレ・姿勢改善を専門に、300人以上を指導してきました。",
      serviceTitle: "パーソナルトレーニング体験・フォームチェック",
      serviceDescription: "運動習慣をつくるための最初の一歩をサポートします。\n\n・体の悩みヒアリング＋目標設定\n・基本的なトレーニングフォームの指導\n・自宅でできるトレーニングメニュー作成\n\n対面（都内ジム）またはオンライン（フォームチェックのみ）で60分。",
      status: "approved",
      role: "origin",
      chainId: chain4.id,
    },

    // ── Chain5：みやた（起点者・チェーンあり）──
    {
      walletAddress: WALLETS.miyata,
      name: "みやたさん",
      bio: "旅行プランナー。年間30回以上旅行に行き、コスパ最強の旅行術を研究中。国内・海外どちらも得意。",
      serviceTitle: "旅行プランニング・おすすめルート作成",
      serviceDescription: "あなただけの旅行プランを一緒に作ります。\n\n・国内旅行（温泉・アウトドア・観光地など）\n・格安海外旅行の計画サポート\n・穴場スポット・地元グルメの情報提供\n\nオンラインで60分。行き先・予算・人数・日程を事前に教えてください。",
      status: "approved",
      role: "origin",
      chainId: chain5.id,
    },

    // ── いとう（起点者・チェーンなし）──
    {
      walletAddress: WALLETS.ito,
      name: "いとうさん",
      bio: "フルスタックエンジニア。プログラミング学習のつまずきポイントを一緒に解決します。",
      serviceTitle: "プログラミング入門サポート・コードレビュー",
      serviceDescription: "プログラミングを始めたい方・学習中に詰まっている方を応援します。\n\n・学習ロードマップ相談（何から始めるか）\n・コードのデバッグ・エラー解決\n・作ったものへのコードレビュー\n\nオンラインで60分。使用言語・学習歴を事前に教えてください。",
      status: "approved",
      role: "origin",
      chainId: null,
    },
  ]

  for (const p of providerData) {
    await db.insert(schema.providers).values(p).onConflictDoNothing()
    const role = p.role === "origin" ? "起点者" : "中継者"
    const chain = p.chainId ? `Chain#${p.chainId}` : "単独"
    process.stdout.write(`  ✓ ${p.name}（${role} / ${chain}）\n`)
  }

  console.log("\n✅ デモデータ投入完了！")
  console.log(`\n  チェーン数:   5`)
  console.log(`  メンバー数:   ${providerData.length}`)
  console.log(`  ノード数:     9`)
  console.log(`\n  /menu で確認してください`)
  process.exit(0)
}

seed().catch((err) => {
  console.error("❌ エラー:", err)
  process.exit(1)
})
