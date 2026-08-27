#!/bin/bash
# ONLOOP — Base Grant Demo Video Generator
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$ROOT/grants/video/tmp"
OUT="$ROOT/grants/video/onloop-demo.mp4"
W=1280; H=720
FONT="/System/Library/Fonts/Helvetica.ttc"
mkdir -p "$TMP"

echo "🎬 ONLOOP デモ動画を生成中..."

# ── ナレーション生成 ─────────────────────────────────────────
echo "🎤 ナレーション音声を生成中..."
say -v Samantha -r 150 \
"What if every act of kindness could be verified on the blockchain?
ONLOOP is a pay-it-forward protocol on Base — where non-monetary acts of giving form permanent on-chain chains.
Browse the kindness menu. Choose someone who offers photography, cooking, or mentoring — completely free.
When you receive kindness, the act is confirmed on Base Mainnet. You earn ON tokens automatically. Every confirmation is a real Base transaction.
The chain grows as each person pays it forward. When it loops back to the origin, everyone receives bonus ON tokens.
Mint an NFT to multiply your rewards — five hundred unique pixel-art characters across eight rarity tiers, from Village all the way to Space.
Every interaction on ONLOOP generates authentic Base transactions. Real people. Real kindness. Permanently on-chain.
ONLOOP is live now — built on Base, for Base." \
-o "$TMP/narration.aiff"

ffmpeg -y -i "$TMP/narration.aiff" -ar 44100 -b:a 192k "$TMP/narration.mp3" 2>/dev/null
echo "   音声生成完了"

# ── Scene builder ────────────────────────────────────────────
make_color_scene() {
  local out=$1; local dur=$2; local bg=$3; local filters=$4
  ffmpeg -y -f lavfi -t "$dur" -i "color=c=${bg}:size=${W}x${H}" \
    -vf "${filters},format=yuv420p" \
    -c:v libx264 -preset fast -r 30 "$out" 2>/dev/null
}

make_image_scene() {
  local out=$1; local dur=$2; local img=$3; local filters=$4
  ffmpeg -y -loop 1 -t "$dur" -i "$img" \
    -vf "scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},setsar=1,eq=brightness=-0.55:saturation=0.8,${filters},format=yuv420p" \
    -c:v libx264 -preset fast -r 30 -t "$dur" "$out" 2>/dev/null
}

dt() {  # drawtext shortcut: text color size x y
  echo "drawtext=fontfile='${FONT}':text='$1':fontcolor=$2:fontsize=$3:x=$4:y=$5:shadowcolor=black@0.8:shadowx=2:shadowy=2"
}

ctr() { echo "(w-text_w)/2"; }  # center x

echo "📽  Scene 1: タイトル (9s)..."
make_color_scene "$TMP/s1.mp4" 9 "0x060610" \
  "$(dt 'ONLOOP' white 90 "(w-text_w)/2" "(h-text_h)/2-110"),
   $(dt 'Pay It Forward. On-Chain.' "0x7ab0ff" 34 "(w-text_w)/2" "(h-text_h)/2+20"),
   $(dt 'Built on Base  ·  @onloop on Farcaster' "0xffcc00" 22 "(w-text_w)/2" "h-90")"

echo "📽  Scene 2: 問題提起 (9s)..."
make_color_scene "$TMP/s2.mp4" 9 "0x080818" \
  "$(dt 'Every day\, kindness happens.' white 44 "(w-text_w)/2" "(h-text_h)/2-140"),
   $(dt '📸 Photos  🍳 Meals  💡 Advice  🎸 Lessons' "0xa0c0e0" 30 "(w-text_w)/2" "(h-text_h)/2-20"),
   $(dt 'None of it exists on-chain. Until now.' "0x0052FF" 36 "(w-text_w)/2" "(h-text_h)/2+100")"

echo "📽  Scene 3: メニュー (10s)..."
make_image_scene "$TMP/s3.mp4" 10 "$ROOT/public/stages/3_japan.png" \
  "$(dt 'KINDNESS MENU' "0xffcc00" 52 "(w-text_w)/2" "100"),
   $(dt 'Browse givers. Request kindness. No money needed.' white 28 "(w-text_w)/2" "210"),
   $(dt '🎨 Design   📷 Photography   🍱 Cooking' "0x7ab0ff" 28 "(w-text_w)/2" "360"),
   $(dt '💻 Coding   🎵 Music   ✈ Travel Planning' "0x7ab0ff" 28 "(w-text_w)/2" "420"),
   $(dt 'onloop-one.vercel.app' "0xffcc00" 24 "(w-text_w)/2" "580")"

echo "📽  Scene 4: チェーンフロー (15s)..."
make_color_scene "$TMP/s4.mp4" 15 "0x050518" \
  "$(dt 'ON-CHAIN KINDNESS CHAIN' "0x0052FF" 42 "(w-text_w)/2" "80"),
   $(dt 'Person A  →  Person B  →  Person C  →  ...' white 32 "(w-text_w)/2" "200"),
   $(dt 'Each confirmation = Base Mainnet transaction' "0x52b788" 28 "(w-text_w)/2" "320"),
   $(dt 'OnChain.confirmNode()   +   OnToken.mint()' "0x3a5a7a" 22 "(w-text_w)/2" "380"),
   $(dt '🎉  Loop Complete →  N × 20 ON Bonus' "0xffcc00" 30 "(w-text_w)/2" "480"),
   $(dt 'Permanently recorded on Base Mainnet' "0x3a6aaa" 22 "(w-text_w)/2" "620")"

echo "📽  Scene 5: NFTコレクション (10s)..."
make_image_scene "$TMP/s5.mp4" 10 "$ROOT/public/stages/7_earth.png" \
  "$(dt 'ONLOOP NFT COLLECTION' "0x9b5de5" 46 "(w-text_w)/2" "80"),
   $(dt '500 pixel-art characters on Base Mainnet' white 28 "(w-text_w)/2" "190"),
   $(dt '8 Rarity Tiers:  Village  →  Space' "0xa0c0e0" 26 "(w-text_w)/2" "290"),
   $(dt 'NFT Boost:  Common ×1.1  →  Legendary ×2.0' "0xffcc00" 28 "(w-text_w)/2" "400"),
   $(dt 'Mint price: 0.0003 ETH  (~\$0.70)' "0x52b788" 26 "(w-text_w)/2" "500")"

echo "📽  Scene 6: Baseネイティブ (9s)..."
make_image_scene "$TMP/s6.mp4" 9 "$ROOT/public/stages/8_space.png" \
  "$(dt 'BUILT ON BASE. FOR BASE.' white 52 "(w-text_w)/2" "120"),
   $(dt '3 Smart Contracts  ·  500 NFTs  ·  ON Token' "0x7ab0ff" 26 "(w-text_w)/2" "260"),
   $(dt 'Coinbase Wallet  ·  Base Names  ·  Farcaster' "0x7ab0ff" 26 "(w-text_w)/2" "310"),
   $(dt 'Every kindness = a real Base transaction.' "0xffcc00" 32 "(w-text_w)/2" "420"),
   $(dt 'onloop-one.vercel.app' white 36 "(w-text_w)/2" "560")"

# ── 結合 ─────────────────────────────────────────────────────
echo "🔗 クリップを結合中..."
printf "file '%s'\n" "$TMP/s1.mp4" "$TMP/s2.mp4" "$TMP/s3.mp4" \
  "$TMP/s4.mp4" "$TMP/s5.mp4" "$TMP/s6.mp4" > "$TMP/concat.txt"
ffmpeg -y -f concat -safe 0 -i "$TMP/concat.txt" -c copy "$TMP/video_raw.mp4" 2>/dev/null

# ── 音声合成 ─────────────────────────────────────────────────
echo "🎵 音声を合成中..."
ffmpeg -y \
  -i "$TMP/video_raw.mp4" \
  -i "$TMP/narration.mp3" \
  -filter_complex "[1:a]apad=whole_dur=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$TMP/video_raw.mp4")[a]" \
  -map 0:v -map "[a]" \
  -c:v copy -c:a aac -b:a 192k -shortest \
  "$OUT" 2>/dev/null

DUR=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$OUT")
echo ""
echo "✅ 完了: $OUT"
echo "   時間: $(printf '%.1f' $DUR)秒 | 解像度: ${W}x${H}"
echo ""
echo "次のステップ:"
echo "  1. open grants/video/onloop-demo.mp4  で動画確認"
echo "  2. Loom/YouTubeにアップロード → URLを取得"
echo "  3. フォームの Demo Link に貼り付け"
