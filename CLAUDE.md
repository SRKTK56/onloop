@AGENTS.md

# ONLOOP（恩ループ）

Baseブロックチェーン上に構築する恩送りサービス。

## コンセプト
- 金銭的対価なしのスキル・好意の連鎖をオンチェーンで記録
- 連鎖が長いほど報酬増加、ループが完成すると特別ボーナス
- ONトークンで報酬を表現（Phase1: DBで管理、Phase2: ERC-20化）

## 技術スタック
- Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui（@base-ui/react）
- OnchainKit v1 + wagmi v2 + viem（Base Sepolia testnet）
- Neon（serverless Postgres）+ Drizzle ORM
- React Flow（チェーン可視化）

## 注意点
- Button コンポーネントは @base-ui/react ベースで `asChild` 非対応
  → Link に buttonVariants() クラスを直接適用すること
- DBアクセスするページは `export const dynamic = "force-dynamic"` 必須
- Route Handler の searchParams は `new URL(req.url).searchParams` で取得（awaitは不要）
- drizzle.config.ts は tsconfig.json の exclude に含めること

## 環境変数（.env.local）
- DATABASE_URL: Neon接続文字列
- NEXT_PUBLIC_ONCHAINKIT_API_KEY: Coinbase Developer Portal
- ADMIN_SECRET: 管理画面の簡易認証
- NEXT_PUBLIC_USE_MAINNET: "true"でBase mainnet（デフォルト: Sepolia）

## 次のステップ
1. Neon DBを作成して DATABASE_URL を設定
2. `npm run db:push` でスキーマを反映
3. OnchainKit API Keyを取得して設定
4. Vercelにデプロイ → Weekly Rewards申請
