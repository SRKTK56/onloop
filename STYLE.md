# ONLOOP — Style Reference

> パステル紙面に貼られた、恩のループのステッカー集

出典: Slush 様式のフル適用（`~/claude/_knowledge/design-refs/slush.md`）。
2026-08-31、旧ピクセルアート様式（Press Start 2P / radius 0 / ハードシャドウ）から全面移行。

## 死守する3つのルール

**この3つを破ると様式が崩れる。実装前に必ず確認すること。**

1. **影を使わない。** `box-shadow` は禁止。立体は色帯と1px黒輪郭だけで出す
2. **グラデーションを使わない。** 唯一の例外は署名モチーフ `LoopRibbon`（立体の重さを全部そこに背負わせる）
3. **青をCTAに使わない。** Base Blue / Electric Blue は装飾専用色。CTAは黒塗り、副アクションは白地黒縁のみ

## Tokens — Colors

| 名前 | 値 | 役割 |
|---|---|---|
| Carbon | `#000000` | 文字・全ての枠線・主CTAの塗り |
| Paper White | `#ffffff` | 紙面・カード地・副ボタン地 |
| Sky Wash | `#dceeff` | セクション色帯（淡い青） |
| Concrete Gray | `#cccccc` | セクション色帯（中間の休符） |
| Soft Mist | `#e9e9e9` | 無効状態・補助面 |
| Base Blue | `#0052ff` | Baseブランド固定色。**装飾専用** |
| Electric Blue | `#4da2ff` | リボン本体・ウォッシュ |
| Mint Pop | `#55db9c` | ステッカー塗り |
| Lavender | `#e9ccff` | ステッカー塗り・セクション色帯 |
| Ember | `#fb4903` | ステッカー塗り |
| Sunburst | `#ffd731` | ステッカー塗り |
| Voltage Violet | `#5c4ade` | ステッカー塗り（濃いので文字は白） |
| Rose | `#ff4d6d` | ONLOOP拡張（日本ステージ） |
| Aqua | `#7ee8e8` | ONLOOP拡張（欧米ステージ） |

**色はすべて「塗り」であって「文字色」ではない。** 文字は常に Carbon。
淡いステッカー色（Sunburst / Aqua / Mint / Lavender）を白地の文字に使うと読めない。
6色以上を1画面で使うこと。1色を「ザ・アクセント」に選んだ時点でこの様式は死ぬ。

### 8ステージの色（`lib/stages.ts`）

村 `#55db9c` / 街 `#fb4903` / 日本 `#ff4d6d` / アジア `#ffd731` /
欧米 `#7ee8e8` / 世界 `#4da2ff` / 地球 `#0052ff` / 宇宙 `#5c4ade`

## Tokens — Typography

| 用途 | 書体 | クラス | 実測値 |
|---|---|---|---|
| 巨大ディスプレイ | Bowlby One | `.display-xl` | clamp(3.5rem, 13vw, 10rem) / lh 0.80 |
| セクション見出し | Bowlby One | `.display-lg` | clamp(2.5rem, 8vw, 5.5rem) / lh 0.82 |
| 数値・小見出し | Bowlby One | `.display-md` | clamp(1.75rem, 4.5vw, 3rem) / lh 0.88 |
| UI・ラベル・英字 | Inter 700 | `.font-ui` | 0.6875–0.8125rem / tracking 0.032em |
| 和文見出し | Zen Maru Gothic 700 | `.h-ja` | lh 1.35 |
| 和文本文 | Zen Maru Gothic | `.font-ja` | text-sm 以上 |

**ディスプレイ書体（lh 0.75–0.85）は英字専用。** 和文は字面枠が正方形なので必ず衝突する。
和文見出しは `.h-ja`（lh 1.35）を使い、英字バナーの一段下の階層に置く。

**最小サイズ**: ラテン 0.7rem / 和文 text-sm（0.875rem）。これ未満を作らない。

## Tokens — 角丸

| 要素 | 値 |
|---|---|
| ボタン・タグ・バッジ・ナビ | `1600px`（ピル） |
| カード | `20px` |
| 大カード・セクション枠 | `40px` |
| 画像・アイコン | `16px` |

**16px未満の角丸を作らない。** 直角はこの様式では「壊れている」ことを意味する。

## Components

- **`.slush-btn`** — 主CTA。黒塗り・白文字・ピル・1px黒縁。1画面に1つ
- **`.slush-btn.slush-btn-ghost`** — 副アクション。白地・黒文字・ピル
- **`.slush-card` / `.slush-card-lg`** — カード。20px / 40px、1px黒縁、影なし
- **`.slush-badge`** — タグ。ピル、塗り＋黒縁
- **`.sticker` / `.sticker-round`** — 装飾ステッカー。`.tilt-l` `.tilt-r` で微回転させ、グリッドに揃えない
- **`.band-sky` / `.band-paper` / `.band-concrete` / `.band-lavender`** — セクション色帯。区切り線も影も置かない
- **`.marquee`** — 黒帯の流れる告知。動くのはここだけ
- **`<LoopRibbon>`** — 署名モチーフ（後述）
- **`<PageHead>`** — ページ見出しブロック（英字ディスプレイ＋和文サブ＋リボン）

## 署名モチーフ — LoopRibbon

`components/shared/LoopRibbon.tsx`。膨らんだチューブで描かれた「恩のループ」。
**全セクションに必ず1つ置く。** 装飾を散らすより1つを反復するほうがブランドになる。

実装上の要点: 管は**3層のストローク**で描く（太い影 → ずらした主色 → ぼかした白ハイライト）。
1本のグラデーションストロークで描くと図形全体が一様に塗られ、平板なブロブになる。

## Do / Don't

### Do
- 1画面でステッカーパレットを複数色使う
- 全ての枠を `1px solid #000000` にする
- セクションは色帯の切り替えだけで分ける（区切り線・影を置かない）
- ディスプレイ文字には必ずリボンかステッカーを添える。単独で置かない
- 装飾ステッカーは回転させ、グリッドから外す

### Don't
- 影を付けない（`box-shadow` は `none` 固定）
- グラデーションを使わない（リボン以外）
- 青をCTA・リンク色にしない
- 緑を success の意味で使わない（装飾色であって状態色ではない）
- 淡いステッカー色を文字色にしない
- 和文に lh 0.85 以下を使わない

## 適用範囲外（意図的に残したもの）

- **`PixelIcon` / `PixelChar` のドット絵**と、NFT・ステージ画像はピクセルアートのまま。
  既存コレクション500体（IPFS + デプロイ済みコントラクト）と結びついた資産であり、
  UIの様式だけを入れ替えている。**UIとNFTアートの世界観は現在ずれている**（既知・意図的）
