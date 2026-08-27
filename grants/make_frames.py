"""ONLOOP デモ動画 — 実画面スクリーンショット版フレーム生成"""
import os, subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT    = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SCREENS = os.path.join(ROOT, "grants/video/tmp/screens")
TMP     = os.path.join(ROOT, "grants/video/tmp")
W, H    = 1280, 720
FPS     = 30
FONT    = "/System/Library/Fonts/Helvetica.ttc"

def fnt(size): return ImageFont.truetype(FONT, size)

def load_screen(name):
    path = os.path.join(SCREENS, f"{name}.png")
    if not os.path.exists(path):
        return None
    img = Image.open(path).convert("RGB")
    # 1280x720にリサイズ（アスペクト比維持でクロップ）
    iw, ih = img.size
    ratio = W / H
    if iw / ih > ratio:
        new_w = int(ih * ratio)
        img = img.crop(((iw-new_w)//2, 0, (iw+new_w)//2, ih))
    else:
        new_h = int(iw / ratio)
        img = img.crop((0, (ih-new_h)//2, iw, (ih+new_h)//2))
    return img.resize((W, H), Image.LANCZOS)

def add_caption(img, text, sub=None):
    """画面下部にキャプションバーを追加"""
    out = img.copy().convert("RGBA")
    bar = Image.new("RGBA", (W, 90), (6, 6, 16, 210))
    out.paste(bar, (0, H-90), bar)
    draw = ImageDraw.Draw(out)
    draw.text((W//2, H-58), text, font=fnt(26), fill=(255,255,255), anchor="mm",
              stroke_width=1, stroke_fill=(0,0,0))
    if sub:
        draw.text((W//2, H-24), sub, font=fnt(18), fill=(122,176,255), anchor="mm")
    return out.convert("RGB")

def add_title_overlay(img, title, subtitle=None):
    """画面上部にタイトルオーバーレイ"""
    out = img.copy().convert("RGBA")
    bar = Image.new("RGBA", (W, 80), (6, 6, 16, 200))
    out.paste(bar, (0, 0), bar)
    draw = ImageDraw.Draw(out)
    draw.text((W//2, 40), title, font=fnt(30), fill=(255,204,0), anchor="mm",
              stroke_width=1, stroke_fill=(0,0,0))
    if subtitle:
        draw.text((W//2, 65), subtitle, font=fnt(18), fill=(160,192,224), anchor="mm")
    return out.convert("RGB")

def sec(s): return int(s * FPS)

def frames_to_video(scenes, out_path):
    import shutil, tempfile
    tmp_dir = tempfile.mkdtemp()
    idx = 0
    for img, n in scenes:
        if img is None:
            img = Image.new("RGB", (W, H), (6,6,16))
        for _ in range(n):
            img.save(os.path.join(tmp_dir, f"f{idx:06d}.png"))
            idx += 1
    cmd = ["ffmpeg","-y","-framerate",str(FPS),"-i",
           os.path.join(tmp_dir,"f%06d.png"),
           "-c:v","libx264","-preset","fast","-pix_fmt","yuv420p","-r",str(FPS),
           out_path]
    subprocess.run(cmd, check=True, capture_output=True)
    shutil.rmtree(tmp_dir)

# ── シーン構成（ナレーションに合わせた画面割り）─────────────
scenes = []

# Scene 1 (0-9s): "What if every act of kindness..."
# → LP ヒーロー
print("📽  Scene 1: LP ヒーロー (9s)...")
img = load_screen("s1_hero")
if img:
    img = add_caption(img, "ONLOOP — Pay It Forward. On-Chain.", "onloop-one.vercel.app")
scenes.append((img, sec(9)))

# Scene 2a (9-13.5s): "ONLOOP is a pay-it-forward protocol on Base..."
# → HOW IT WORKS
print("📽  Scene 2a: HOW IT WORKS (4.5s)...")
img = load_screen("s2a_how")
if img:
    img = add_caption(img, "How ONLOOP works — 4 simple steps")
scenes.append((img, sec(4.5)))

# Scene 2b (13.5-18s): "...permanent on-chain chains"
# → ON TOKEN セクション
print("📽  Scene 2b: ON TOKEN (4.5s)...")
img = load_screen("s2b_ontoken")
if img:
    img = add_caption(img, "ON Token — earned for every act of kindness")
scenes.append((img, sec(4.5)))

# Scene 3a (18-23s): "Browse the kindness menu..."
# → メニューページ
print("📽  Scene 3a: メニュー (5s)...")
img = load_screen("s3_menu")
if img:
    img = add_caption(img, "Kindness Menu — browse and request a giver")
scenes.append((img, sec(5)))

# Scene 3b (23-28s): "Choose someone who offers..."
# → メニューモーダル詳細
print("📽  Scene 3b: モーダル (5s)...")
img = load_screen("s3b_menu_modal")
if img:
    img = add_caption(img, "View details — see the chain they belong to")
scenes.append((img, sec(5)))

# Scene 4a (28-35s): "When you receive kindness... confirmed on Base Mainnet..."
# → NFT LP セクション
print("📽  Scene 4a: NFT LP (7s)...")
img = load_screen("s4a_nft_lp")
if img:
    img = add_caption(img, "Each confirmation = a real Base Mainnet transaction")
scenes.append((img, sec(7)))

# Scene 4b (35-43s): "The chain grows... loop... bonus ON tokens"
# → WORLD STAGES
print("📽  Scene 4b: WORLD STAGES (8s)...")
img = load_screen("s4b_stages")
if img:
    img = add_caption(img, "World Stages — the longer the chain, the higher the rewards")
scenes.append((img, sec(8)))

# Scene 5a (43-48s): "Mint an NFT..."
# → MINTページ上部
print("📽  Scene 5a: MINT (5s)...")
img = load_screen("s5_mint")
if img:
    img = add_caption(img, "ONLOOP NFT — 500 unique characters on Base Mainnet")
scenes.append((img, sec(5)))

# Scene 5b (48-53s): "...eight rarity tiers, Village to Space"
# → MINTページ下部（レアリティ表）
print("📽  Scene 5b: レアリティ (5s)...")
img = load_screen("s5b_mint_rarity")
if img:
    img = add_caption(img, "8 rarity tiers — Common to Legendary — mint for ~$0.70")
scenes.append((img, sec(5)))

# Scene 6a (53-57s): "Every interaction on ONLOOP generates authentic Base transactions."
# → Basescan
print("📽  Scene 6a: Basescan (4s)...")
img = load_screen("s6b_basescan")
if img:
    img = add_caption(img, "OnChain contract — verified on Base Mainnet",
                      "0x568db29ef6999e9c2815cbf2d103ebb26d0a9a71")
scenes.append((img, sec(4)))

# Scene 6b (57-62s): "ONLOOP is live now — built on Base, for Base."
# → LP CTA
print("📽  Scene 6b: CTA (5s)...")
img = load_screen("s6_cta")
if img:
    img = add_caption(img, "ONLOOP is live now — built on Base, for Base.")
scenes.append((img, sec(5)))

# ── 動画出力 ─────────────────────────────────────────────
print("\n🎞  動画書き出し中...")
raw = os.path.join(TMP, "video_raw.mp4")
frames_to_video(scenes, raw)
total = sum(n for _, n in scenes) / FPS
print(f"✅ 映像完了: {total:.1f}秒")
