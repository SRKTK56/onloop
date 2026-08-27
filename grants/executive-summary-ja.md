# ONLOOP — エグゼクティブサマリー（日本語版）

## プロジェクト概要

**ONLOOP（恩ループ）** は、金銭を介さない「恩送り（pay-it-forward）」の連鎖をBase上にオンチェーン記録し、参加者にONトークンとNFTで報酬を与えるプロトコルです。

---

## 解決する課題

ブロックチェーンは金融取引を革新しましたが、「人の善意」はまだオンチェーンに存在していません。

写真を撮ってあげる・料理を振る舞う・スキルを教える——こうした金銭を介さない好意は毎日世界中で行われていますが、検証可能な記録が残らず、incentiveもありません。

**ONLOOPは「善意の証明」をBase上に刻みます。**

---

## ソリューション

### 仕組み
1. メニューから「恩送り」をお願いする（写真撮影・料理・相談など）
2. 好意が届いたことをBase上に記録（`OnChain`コントラクト）
3. 参加者にONトークンが自動付与
4. 受け取った人が次の誰かへ繋ぐことで「連鎖」が伸びる
5. 連鎖が起点に戻ると「ループ完成」— 全員にボーナス

### ONトークン報酬設計
- 恩送り参加：+1〜5 ON
- ループ完成（起点者）：N×20 ON
- Legendary NFT保有：報酬×2.0倍

---

## Baseエコシステムへの貢献

### トランザクション創出
恩送りの確認ごとに **2件のBaseトランザクション** が発生：
- `OnChain.confirmNode()` — 連鎖の永久記録
- `OnToken.mint()` — ON報酬のMint

NFTミント・チェーン作成を含めると、ユーザー1人あたりの行動がBase上の複数TXを生み出します。

### 新規ユーザー層の獲得
ONLOOPはDeFiやゲームではなく「社会的善意」をターゲットにしています。暗号資産に馴染みのない一般ユーザーが価値観から参加できる設計で、Baseの裾野を広げます。

### Coinbase Wallet Native
`preference: "all"` でCoinbase Walletを中心に設計。`onloop.base.eth`（Base Name）を公式IDとして使用し、完全にBase-nativeなプロダクトです。

---

## 技術概要

### デプロイ済みコントラクト（Base Mainnet）

| コントラクト | アドレス | 役割 |
|---|---|---|
| ON Token (ERC-20) | `0x84e54ce64d13220365f5d1cb4a6fcc5bf35c6ac3` | 恩送り報酬トークン（上限90万枚） |
| OnChain | `0x568db29ef6999e9c2815cbf2d103ebb26d0a9a71` | 恩送り連鎖の永久記録 |
| OnLoopNFT (ERC-721) | `0x760D3dd3e0DB6B593215F0E694D53765d3780D7D` | 500体のピクセルアートNFT |

### スタック
- Next.js 16 + TypeScript + wagmi v2 + viem
- Coinbase Wallet コネクター
- Neon PostgreSQL + Drizzle ORM
- Vercel + IPFS（Pinata）

---

## チーム

**江口さん（ソロ開発者）**  
- プロダクト設計・スマートコントラクト・フロントエンド・NFT生成すべてを一人で開発
- Base Name: `onloop.base.eth`
- 連絡先: shinchi.takahiro24@gmail.com

---

## ロードマップ（グラント活用後）

| フェーズ | 期間 | 主要マイルストーン |
|---|---|---|
| Phase 2 | Q2–Q3 2026 | コントラクト監査・マーケティング・PWA・Farcaster連携 |
| Phase 3 | Q4 2026〜 | MAU 1,000+・ONトークンガバナンス・NFTシリーズ2 |

---

## 予算内訳（$15,000）

| 用途 | 金額 |
|---|---|
| スマートコントラクト監査 | $4,000 |
| マーケティング・コミュニティ | $5,000 |
| プロダクト開発（PWA・Farcaster等） | $4,000 |
| 法務・コンプライアンス | $2,000 |

---

## なぜ今、Baseに申請するか

ONLOOPはすでにBase Mainnet上で動いており、スマートコントラクトも3本デプロイ済みです。グラントは「アイデアの実現」ではなく **「実証されたMVPのスケールアップ」** に使います。

Baseが掲げる「bring the world onchain」のビジョンに、ONLOOPは「善意をonchainに」という形で貢献します。

---

## リンク

- **アプリ:** https://onloop-one.vercel.app
- **Basescan（NFT）:** https://basescan.org/address/0x760D3dd3e0DB6B593215F0E694D53765d3780D7D
- **GitHub:** https://github.com/SRKTK56/onloop
- **受取ウォレット:** onloop.base.eth
