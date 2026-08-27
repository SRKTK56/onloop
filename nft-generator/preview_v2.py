"""各ステージ・体型・表情のサンプルを並べたプレビューシート"""
from PIL import Image
import os, json

BASE = os.path.dirname(__file__)
L    = f"{BASE}/layers"
SCALE = 4   # 64→256px で見やすく拡大

def load(path): return Image.open(path).convert("RGBA")
def compose(layers):
    b = layers[0].copy()
    for l in layers[1:]: b = Image.alpha_composite(b, l)
    return b
def upscale(img): return img.resize((img.width*SCALE, img.height*SCALE), Image.NEAREST)

def make_sample(bg, body, color, loop, expr, acc):
    layers = [
        load(f"{L}/01_background/{bg}.png"),
        load(f"{L}/02_body/{body}_{color}.png"),
        load(f"{L}/04_loop/loop_{loop}.png"),
        load(f"{L}/05_expression/{expr}.png"),
        load(f"{L}/06_accessory/{acc}.png"),
    ]
    return upscale(compose(layers))

W = 256  # each cell width after scale

# ── Row 1: 4 body shapes × base_blue, smile, ring1, space bg ──────────────
print("Building body shape row...")
shapes = [("round","cap"), ("slim","antenna"), ("fluffy","crown"), ("crystal","halo")]
row1 = Image.new("RGB", (W*4, W), (10,10,30))
for i, (shape, acc) in enumerate(shapes):
    img = make_sample("space", shape, "base_blue", 3, "smile", acc)
    row1.paste(img.convert("RGB"), (i*W, 0))

# ── Row 2: 4 color variants, round body ───────────────────────────────────
print("Building color row...")
colors = [("base_blue","village","glasses"),("neon_blue","town","star"),
          ("ice_blue","japan","gem"),("midnight","space","crown")]
row2 = Image.new("RGB", (W*4, W), (10,10,30))
for i,(color,bg,acc) in enumerate(colors):
    img = make_sample(bg, "round", color, 1, "wink", acc)
    row2.paste(img.convert("RGB"), (i*W, 0))

# ── Row 3: 6 expressions (round, base_blue, ring1, world) ─────────────────
print("Building expression row...")
exprs = ["smile","serious","surprised","wink","sparkle","sleepy"]
accs  = ["none","glasses","monocle","none","star","none"]
row3 = Image.new("RGB", (W*6, W), (10,10,30))
for i,(expr,acc) in enumerate(zip(exprs,accs)):
    img = make_sample("world", "round", "base_blue", 1, expr, acc)
    row3.paste(img.convert("RGB"), (i*W, 0))

# ── Row 4: 8 backgrounds, round, base_blue, smile, 3 rings ───────────────
print("Building background row...")
bgs  = ["village","town","japan","asia","west","world","earth","space"]
accs4= ["cap","scarf","bow","flag","camera","book","heart","halo"]
row4 = Image.new("RGB", (W*8, W), (10,10,30))
for i,(bg,acc) in enumerate(zip(bgs,accs4)):
    loop = 1 if i<2 else (2 if i<6 else 3)
    img = make_sample(bg, "round", "base_blue", loop, "smile", acc)
    row4.paste(img.convert("RGB"), (i*W, 0))

# ── Combine all rows ──────────────────────────────────────────────────────
PAD = 8
total_h = W + PAD + W + PAD + W + PAD + W + PAD*2
total_w = W * 8
sheet = Image.new("RGB", (total_w, total_h), (6, 6, 18))

# center shorter rows
def paste_row(row, y_off):
    x_off = (total_w - row.width) // 2
    sheet.paste(row, (x_off, y_off))

y = PAD
paste_row(row1, y); y += W + PAD
paste_row(row2, y); y += W + PAD
paste_row(row3, y); y += W + PAD
paste_row(row4, y)

out = f"{BASE}/output/preview_v2.png"
sheet.save(out)
print(f"✅ Preview sheet saved: {out}")
print(f"   Size: {sheet.width}×{sheet.height}px")
