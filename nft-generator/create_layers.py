"""
ONe (オーネ) NFT コレクション — レイヤー生成スクリプト
全トレイトPNGファイルをコードで生成する
"""
from PIL import Image, ImageDraw
import math, random, os

SIZE = 64  # キャンバスサイズ

# ── カラーパレット ──────────────────────────────────────────────
C = {
    "base_blue":  (0,   82,  255, 255),
    "neon_blue":  (77,  140, 255, 255),
    "ice_blue":   (168, 216, 255, 255),
    "midnight":   (0,   26,  122, 255),
    "dark_navy":  (10,  10,  42,  255),
    "deep_space": (4,   4,   18,  255),
    "white":      (255, 255, 255, 255),
    "off_white":  (220, 235, 255, 255),
    "dark":       (17,  17,  34,  255),
    "gold":       (255, 215, 0,   255),
    "gold_dim":   (180, 140, 0,   255),
    "teal":       (0,   200, 200, 255),
    "purple":     (100, 50,  200, 255),
    "transparent":(0,   0,   0,   0  ),
}

def new_img():
    return Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))

def save(img, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "PNG")
    print(f"  saved: {os.path.basename(path)}")


# ══════════════════════════════════════════════════════════════
# [1] 背景レイヤー — 8ステージ
# ══════════════════════════════════════════════════════════════

def make_star_field(draw, count, color, y_max=64, seed=0):
    rng = random.Random(seed)
    for _ in range(count):
        x = rng.randint(0, 63)
        y = rng.randint(0, y_max)
        br = rng.random()
        alpha = int(100 + br * 155)
        r, g, b, _ = color
        draw.point((x, y), fill=(r, g, b, alpha))

def make_bg_village():
    """Stage 1 — 村 / 夜の村・青い星空"""
    img = new_img()
    draw = ImageDraw.Draw(img)
    # sky gradient (dark navy to slightly lighter)
    for y in range(64):
        t = y / 64
        r = int(10 + t * 8)
        g = int(10 + t * 12)
        b = int(42 + t * 20)
        draw.line([(0, y), (63, y)], fill=(r, g, b, 255))
    # stars
    make_star_field(draw, 25, C["ice_blue"], y_max=30, seed=1)
    # ground
    for y in range(50, 64):
        draw.line([(0, y), (63, y)], fill=(5, 8, 30, 255))
    # houses silhouette
    for hx, hw in [(2, 12), (16, 10), (30, 14), (46, 10), (56, 8)]:
        draw.rectangle([hx, 43, hx+hw, 54], fill=(0, 18, 80, 255))
        draw.polygon([(hx-1, 43), (hx+hw//2, 36), (hx+hw+1, 43)], fill=(0, 26, 122, 255))
        # window
        draw.rectangle([hx+3, 46, hx+5, 49], fill=(0, 60, 180, 255))
    return img

def make_bg_town():
    """Stage 2 — 街 / ネオン街・雨"""
    img = new_img()
    draw = ImageDraw.Draw(img)
    for y in range(64):
        t = y / 64
        r = int(8 + t * 10)
        g = int(8 + t * 5)
        b = int(35 + t * 15)
        draw.line([(0, y), (63, y)], fill=(r, g, b, 255))
    # rain streaks
    rng = random.Random(2)
    for _ in range(30):
        x = rng.randint(0, 63)
        y = rng.randint(0, 50)
        draw.line([(x, y), (x-1, y+4)], fill=(77, 140, 255, 60))
    # buildings
    for bx, bh, bw in [(0,30,10),(12,22,8),(22,35,12),(36,25,10),(48,18,8),(58,28,6)]:
        draw.rectangle([bx, 64-bh, bx+bw, 63], fill=(0, 15, 60, 255))
        # neon windows
        rng2 = random.Random(bx)
        for wy in range(64-bh+2, 63, 5):
            for wx in range(bx+1, bx+bw-1, 3):
                if rng2.random() > 0.3:
                    draw.rectangle([wx, wy, wx+1, wy+2], fill=(0, 82, 255, 200))
    return img

def make_bg_japan():
    """Stage 3 — 日本 / 富士山シルエット"""
    img = new_img()
    draw = ImageDraw.Draw(img)
    for y in range(64):
        t = y / 64
        r = int(5 + t * 15)
        g = int(5 + t * 10)
        b = int(30 + t * 30)
        draw.line([(0, y), (63, y)], fill=(r, g, b, 255))
    make_star_field(draw, 20, C["ice_blue"], y_max=25, seed=3)
    # Mt. Fuji
    draw.polygon([(4, 52), (32, 22), (60, 52)], fill=(0, 20, 80, 255))
    draw.polygon([(24, 28), (32, 22), (40, 28)], fill=(168, 216, 255, 200))  # snow cap
    # torii silhouette
    draw.rectangle([38, 42, 54, 44], fill=(0, 30, 120, 255))
    draw.rectangle([40, 38, 41, 52], fill=(0, 30, 120, 255))
    draw.rectangle([51, 38, 52, 52], fill=(0, 30, 120, 255))
    # water reflection
    for y in range(54, 64):
        t = (y - 54) / 10
        draw.line([(0, y), (63, y)], fill=(0, int(30+t*20), int(80+t*40), 255))
    return img

def make_bg_asia():
    """Stage 4 — アジア / 提灯・夜市"""
    img = new_img()
    draw = ImageDraw.Draw(img)
    for y in range(64):
        t = y / 64
        draw.line([(0, y), (63, y)], fill=(int(8+t*12), int(5+t*8), int(35+t*20), 255))
    # lanterns
    lantern_positions = [(8, 8), (20, 12), (34, 6), (46, 10), (56, 14), (14, 20), (44, 18)]
    for lx, ly in lantern_positions:
        draw.ellipse([lx-4, ly-5, lx+4, ly+5], fill=(0, 60, 200, 255))
        draw.ellipse([lx-3, ly-4, lx+3, ly+4], fill=(0, 82, 255, 200))
        draw.line([(lx, ly-5), (lx, ly-8)], fill=(0, 40, 150, 255))
    # market stalls
    draw.rectangle([0, 48, 63, 63], fill=(5, 8, 30, 255))
    for sx in range(0, 64, 14):
        draw.rectangle([sx, 44, sx+12, 48], fill=(0, 30, 120, 255))
    return img

def make_bg_west():
    """Stage 5 — 欧米 / 夜景・自由の女神シルエット"""
    img = new_img()
    draw = ImageDraw.Draw(img)
    for y in range(64):
        t = y / 64
        draw.line([(0, y), (63, y)], fill=(int(6+t*12), int(6+t*8), int(28+t*20), 255))
    make_star_field(draw, 15, C["ice_blue"], y_max=20, seed=5)
    # Statue of Liberty silhouette (simplified)
    draw.rectangle([28, 36, 36, 54], fill=(0, 20, 80, 255))
    draw.rectangle([26, 32, 38, 36], fill=(0, 20, 80, 255))
    draw.rectangle([28, 28, 36, 32], fill=(0, 20, 80, 255))
    draw.rectangle([30, 24, 34, 28], fill=(0, 20, 80, 255))
    draw.rectangle([32, 20, 33, 24], fill=(0, 82, 200, 255))  # torch glow
    # city lights
    rng = random.Random(5)
    for _ in range(40):
        x = rng.randint(0, 63)
        y = rng.randint(42, 63)
        draw.point((x, y), fill=(0, rng.randint(60, 120), 255, 180))
    draw.rectangle([0, 54, 63, 63], fill=(4, 6, 22, 255))
    return img

def make_bg_world():
    """Stage 6 — 世界 / 地球儀・宇宙の縁"""
    img = new_img()
    draw = ImageDraw.Draw(img)
    for y in range(64):
        t = y / 64
        draw.line([(0, y), (63, y)], fill=(int(4+t*8), int(4+t*8), int(20+t*25), 255))
    make_star_field(draw, 30, C["neon_blue"], seed=6)
    # Earth (circle with continent hint)
    draw.ellipse([16, 16, 48, 48], fill=(0, 40, 150, 255))
    draw.ellipse([17, 17, 47, 47], fill=(0, 55, 200, 255))
    # continent shapes
    draw.ellipse([22, 22, 30, 32], fill=(0, 82, 255, 255))
    draw.ellipse([32, 24, 42, 35], fill=(0, 82, 255, 255))
    draw.ellipse([24, 34, 35, 44], fill=(0, 82, 255, 255))
    # atmosphere glow
    draw.arc([14, 14, 50, 50], 0, 360, fill=(77, 140, 255, 100), width=2)
    return img

def make_bg_earth():
    """Stage 7 — 地球 / 宇宙から見た地球"""
    img = new_img()
    draw = ImageDraw.Draw(img)
    # deep space
    draw.rectangle([0, 0, 63, 63], fill=(4, 4, 18, 255))
    make_star_field(draw, 40, C["white"], seed=7)
    make_star_field(draw, 15, C["neon_blue"], seed=70)
    # distant Earth (bottom)
    draw.ellipse([0, 44, 63, 80], fill=(0, 52, 200, 255))
    draw.ellipse([1, 45, 62, 79], fill=(0, 68, 220, 255))
    # cloud hints
    draw.ellipse([5, 48, 25, 55], fill=(77, 140, 255, 150))
    draw.ellipse([35, 46, 58, 52], fill=(77, 140, 255, 150))
    return img

def make_bg_space():
    """Stage 8 — 宇宙 / 星雲・Base Blue星"""
    img = new_img()
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, 63, 63], fill=(3, 3, 15, 255))
    make_star_field(draw, 50, C["white"], seed=8)
    make_star_field(draw, 20, C["neon_blue"], seed=80)
    make_star_field(draw, 10, C["gold"], seed=81)
    # nebula wisps
    for i in range(5):
        rng = random.Random(8 + i)
        cx, cy = rng.randint(10, 54), rng.randint(10, 54)
        r = rng.randint(8, 18)
        for dr in range(r, 0, -2):
            alpha = int(20 * (1 - dr/r))
            draw.ellipse([cx-dr, cy-dr//2, cx+dr, cy+dr//2],
                        fill=(0, 82, 255, alpha))
    # bright star
    draw.point((48, 12), fill=(255, 255, 255, 255))
    draw.point((47, 12), fill=(200, 220, 255, 180))
    draw.point((49, 12), fill=(200, 220, 255, 180))
    draw.point((48, 11), fill=(200, 220, 255, 180))
    draw.point((48, 13), fill=(200, 220, 255, 180))
    return img

BG_MAKERS = [
    make_bg_village, make_bg_town, make_bg_japan, make_bg_asia,
    make_bg_west, make_bg_world, make_bg_earth, make_bg_space,
]
BG_NAMES = ["village", "town", "japan", "asia", "west", "world", "earth", "space"]


# ══════════════════════════════════════════════════════════════
# [2+3] 体レイヤー — 4体型 × 4色
# ══════════════════════════════════════════════════════════════

# ONe character body pixel data (32×40 area centered in 64×64 canvas)
# Each body shape defined as pixel offsets from center (32, 38)

def draw_body_round(draw, cx, cy, fill, outline):
    """丸型 — シンプルな丸いブロブ"""
    # Main body
    draw.ellipse([cx-12, cy-14, cx+12, cy+14], fill=fill)
    # Slightly wider in middle
    draw.ellipse([cx-13, cy-7, cx+13, cy+7], fill=fill)
    # Outline
    for angle in range(0, 360, 5):
        r1, r2 = 13.5, 14.5
        rad = math.radians(angle)
        x1, y1 = cx + r1*math.cos(rad), cy + r1*math.sin(rad)*0.85
        x2, y2 = cx + r2*math.cos(rad), cy + r2*math.sin(rad)*0.85
        draw.line([(x1, y1), (x2, y2)], fill=outline)
    # shade (right+bottom darker)
    shade_r = int(fill[0] * 0.7)
    shade_g = int(fill[1] * 0.7)
    shade_b = int(fill[2] * 0.8)
    shade = (shade_r, shade_g, shade_b, 180)
    draw.ellipse([cx+2, cy+2, cx+11, cy+13], fill=shade)
    # highlight (top-left)
    hl_r = min(255, int(fill[0] * 1.3 + 50))
    hl_g = min(255, int(fill[1] * 1.3 + 50))
    hl_b = min(255, int(fill[2] * 1.1 + 30))
    draw.ellipse([cx-9, cy-10, cx-4, cy-5], fill=(hl_r, hl_g, hl_b, 200))

def draw_body_slim(draw, cx, cy, fill, outline):
    """細長型 — スリムなオーネ"""
    draw.ellipse([cx-9, cy-17, cx+9, cy+17], fill=fill)
    draw.ellipse([cx-10, cy-8, cx+10, cy+8], fill=fill)
    for angle in range(0, 360, 5):
        r1, r2 = 10, 11
        rad = math.radians(angle)
        x1, y1 = cx + r1*math.cos(rad)*0.75, cy + r1*math.sin(rad)
        x2, y2 = cx + r2*math.cos(rad)*0.75, cy + r2*math.sin(rad)
        draw.line([(x1, y1), (x2, y2)], fill=outline)
    shade_r = int(fill[0] * 0.7)
    shade_g = int(fill[1] * 0.7)
    shade_b = int(fill[2] * 0.8)
    draw.ellipse([cx+1, cy+2, cx+8, cy+15], fill=(shade_r, shade_g, shade_b, 160))

def draw_body_fluffy(draw, cx, cy, fill, outline):
    """ふわふわ型 — モコモコ感"""
    # Multiple overlapping circles
    bumps = [
        (cx-8, cy-10, 8), (cx+8, cy-10, 8),
        (cx-11, cy, 8),   (cx+11, cy, 8),
        (cx-8, cy+8, 8),  (cx+8, cy+8, 8),
        (cx, cy-4, 11),
    ]
    for bx, by, br in bumps:
        draw.ellipse([bx-br, by-br, bx+br, by+br], fill=fill)
    # Main fill
    draw.ellipse([cx-10, cy-12, cx+10, cy+12], fill=fill)
    # Fluffy outline dots
    for bx, by, br in bumps:
        for angle in range(0, 360, 30):
            rad = math.radians(angle)
            ox = bx + (br+0.5)*math.cos(rad)
            oy = by + (br+0.5)*math.sin(rad)
            draw.point((int(ox), int(oy)), fill=outline)

def draw_body_crystal(draw, cx, cy, fill, outline):
    """クリスタル型 — 多角形のエッジ"""
    # Hexagonal-ish shape
    points = []
    for i, angle in enumerate(range(0, 360, 45)):
        r = 13 if i % 2 == 0 else 10
        rad = math.radians(angle - 22)
        points.append((cx + r*math.cos(rad), cy + r*math.sin(rad)))
    draw.polygon(points, fill=fill)
    draw.polygon(points, outline=outline)
    # Inner crystal lines
    r2, g2, b2 = min(255, fill[0]+60), min(255, fill[1]+60), min(255, fill[2]+40)
    for i in range(0, len(points), 2):
        draw.line([(cx, cy), points[i]], fill=(r2, g2, b2, 120))

BODY_SHAPES = {
    "round":   draw_body_round,
    "slim":    draw_body_slim,
    "fluffy":  draw_body_fluffy,
    "crystal": draw_body_crystal,
}

BODY_COLORS = {
    "base_blue":  ((0,   82,  255, 255), (0,   40,  150, 255)),
    "neon_blue":  ((77,  140, 255, 255), (30,  80,  200, 255)),
    "ice_blue":   ((140, 200, 255, 255), (80,  140, 220, 255)),
    "midnight":   ((20,  60,  180, 255), (0,   20,  100, 255)),
}

def make_body_layer(shape_name, color_name):
    img = new_img()
    draw = ImageDraw.Draw(img)
    fill, outline = BODY_COLORS[color_name]
    BODY_SHAPES[shape_name](draw, 32, 36, fill, outline)
    return img


# ══════════════════════════════════════════════════════════════
# [4] ループリングレイヤー — 3種
# ══════════════════════════════════════════════════════════════

def make_loop_1(glow_color=(0, 82, 255, 255)):
    """1リング — Common/Uncommon"""
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 32, 40  # chest position
    r = 6
    # Outer glow
    draw.arc([cx-r-2, cy-r-2, cx+r+2, cy+r+2], 0, 360, fill=(*glow_color[:3], 60), width=2)
    # Ring
    draw.arc([cx-r, cy-r, cx+r, cy+r], 0, 360, fill=glow_color, width=2)
    # Inner highlight
    draw.arc([cx-r+1, cy-r+1, cx+r-1, cy+r-1], 200, 340,
             fill=(min(255, glow_color[0]+100), min(255, glow_color[1]+100), 255, 180), width=1)
    return img

def make_loop_2(glow_color=(77, 140, 255, 255)):
    """2リング — Rare"""
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 32, 40
    for r, alpha in [(5, 255), (8, 200)]:
        draw.arc([cx-r-1, cy-r-1, cx+r+1, cy+r+1], 0, 360,
                 fill=(*glow_color[:3], 40), width=2)
        draw.arc([cx-r, cy-r, cx+r, cy+r], 0, 360,
                 fill=(*glow_color[:3], alpha), width=2)
    draw.point((cx, cy-5), fill=(168, 216, 255, 255))
    draw.point((cx, cy+5), fill=(168, 216, 255, 200))
    return img

def make_loop_3(glow_color=(0, 82, 255, 255)):
    """3リング — Epic/Legendary (with glow)"""
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 32, 40
    for r, alpha, width in [(4, 255, 2), (7, 220, 2), (10, 180, 1)]:
        for dr in range(3, 0, -1):
            draw.arc([cx-r-dr, cy-r-dr, cx+r+dr, cy+r+dr], 0, 360,
                     fill=(*glow_color[:3], 15), width=1)
        draw.arc([cx-r, cy-r, cx+r, cy+r], 0, 360,
                 fill=(*glow_color[:3], alpha), width=width)
    draw.point((cx, cy-4), fill=(255, 255, 255, 220))
    draw.point((cx, cy+4), fill=(255, 255, 255, 200))
    draw.point((cx-4, cy), fill=(255, 255, 255, 180))
    draw.point((cx+4, cy), fill=(255, 255, 255, 180))
    return img

LOOP_MAKERS = [make_loop_1, make_loop_2, make_loop_3]
LOOP_NAMES = ["loop_1", "loop_2", "loop_3"]


# ══════════════════════════════════════════════════════════════
# [5] 表情レイヤー — 6種
# ══════════════════════════════════════════════════════════════

def make_eyes_base(draw, cx, cy, pupil_color=(17, 17, 34, 255)):
    """共通の目の構造"""
    eye_y = cy - 5
    for ex in [cx-5, cx+5]:
        draw.rectangle([ex-2, eye_y-2, ex+2, eye_y+2], fill=C["white"])
        draw.point((ex, eye_y), fill=pupil_color)

def make_expr_smile():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 32, 34
    make_eyes_base(draw, cx, cy)
    # Sparkle in eyes
    draw.point((27, 27), fill=C["neon_blue"])
    draw.point((37, 27), fill=C["neon_blue"])
    # Smile
    draw.arc([cx-4, cy+2, cx+4, cy+8], 0, 180, fill=C["dark"], width=1)
    return img

def make_expr_serious():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 32, 34
    make_eyes_base(draw, cx, cy, (0, 20, 100, 255))
    # Flat mouth
    draw.line([(cx-3, cy+5), (cx+3, cy+5)], fill=C["dark"])
    # Slight brow furrow
    draw.line([(27, 28), (29, 29)], fill=(0, 40, 150, 200))
    draw.line([(37, 28), (35, 29)], fill=(0, 40, 150, 200))
    return img

def make_expr_surprised():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 32, 33
    # Wide eyes
    for ex in [cx-5, cx+5]:
        draw.rectangle([ex-3, cy-3, ex+3, cy+3], fill=C["white"])
        draw.rectangle([ex-1, cy-1, ex+1, cy+1], fill=C["dark"])
    # O mouth
    draw.ellipse([cx-3, cy+4, cx+3, cy+9], fill=C["dark"])
    draw.ellipse([cx-2, cy+5, cx+2, cy+8], fill=(30, 30, 60, 255))
    return img

def make_expr_wink():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 32, 34
    # Left eye (open)
    draw.rectangle([cx-7, cy-3, cx-3, cy+1], fill=C["white"])
    draw.point((cx-5, cy-1), fill=C["dark"])
    # Right eye (wink)
    draw.arc([cx+3, cy-2, cx+7, cy+2], 0, 180, fill=C["dark"], width=1)
    # Smile
    draw.arc([cx-3, cy+3, cx+3, cy+8], 0, 180, fill=C["dark"], width=1)
    return img

def make_expr_sparkle():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 32, 34
    # Star eyes
    for ex in [cx-5, cx+5]:
        draw.rectangle([ex-2, cy-3, ex+2, cy+1], fill=C["ice_blue"])
        draw.point((ex, cy-1), fill=C["white"])
        draw.point((ex-2, cy-3), fill=C["white"])
        draw.point((ex+2, cy-3), fill=C["white"])
    # Big smile
    draw.arc([cx-5, cy+1, cx+5, cy+9], 0, 180, fill=C["base_blue"], width=2)
    return img

def make_expr_sleepy():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 32, 35
    # Half-closed eyes
    for ex in [cx-5, cx+5]:
        draw.rectangle([ex-2, cy-1, ex+2, cy+2], fill=C["white"])
        draw.line([(ex-2, cy-1), (ex+2, cy-1)], fill=C["dark"])
        draw.point((ex, cy), fill=C["dark"])
    # Small mouth
    draw.line([(cx-2, cy+5), (cx+2, cy+5)], fill=C["dark"])
    # Z symbol
    draw.line([(cx+8, cy-8), (cx+12, cy-8)], fill=C["neon_blue"], width=1)
    draw.line([(cx+12, cy-8), (cx+8, cy-4)], fill=C["neon_blue"], width=1)
    draw.line([(cx+8, cy-4), (cx+12, cy-4)], fill=C["neon_blue"], width=1)
    return img

EXPR_MAKERS = [make_expr_smile, make_expr_serious, make_expr_surprised,
               make_expr_wink, make_expr_sparkle, make_expr_sleepy]
EXPR_NAMES = ["smile", "serious", "surprised", "wink", "sparkle", "sleepy"]


# ══════════════════════════════════════════════════════════════
# [6] アクセサリーレイヤー — 20種 + none
# ══════════════════════════════════════════════════════════════

def make_acc_none():
    return new_img()

def make_acc_tophat():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx = 32
    draw.rectangle([cx-8, 14, cx+8, 16], fill=(0, 40, 150, 255))  # brim
    draw.rectangle([cx-5, 6, cx+5, 14], fill=(0, 20, 100, 255))   # top
    draw.rectangle([cx-5, 13, cx+5, 14], fill=(0, 60, 200, 255))  # band
    return img

def make_acc_cap():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx = 32
    draw.ellipse([cx-7, 16, cx+7, 24], fill=(0, 82, 255, 255))
    draw.rectangle([cx-7, 19, cx+12, 22], fill=(0, 60, 200, 255))  # brim
    draw.rectangle([cx-3, 16, cx+3, 18], fill=(168, 216, 255, 255))  # logo stripe
    return img

def make_acc_crown():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx = 32
    draw.rectangle([cx-8, 16, cx+8, 20], fill=C["gold"])
    draw.polygon([(cx-8, 16), (cx-8, 12), (cx-5, 15)], fill=C["gold"])
    draw.polygon([(cx, 16), (cx, 10), (cx+3, 15)], fill=C["gold"])
    draw.polygon([(cx+8, 16), (cx+8, 12), (cx+5, 15)], fill=C["gold"])
    draw.point((cx-8, 12), fill=(255, 255, 200, 255))
    draw.point((cx, 10), fill=(255, 255, 200, 255))
    draw.point((cx+8, 12), fill=(255, 255, 200, 255))
    return img

def make_acc_halo():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx = 32
    for r in range(9, 6, -1):
        alpha = int(255 * (r - 6) / 3)
        draw.arc([cx-r, 14-r//2, cx+r, 18-r//2], 0, 360,
                 fill=(*C["gold"][:3], alpha), width=1)
    draw.arc([cx-7, 10, cx+7, 16], 0, 360, fill=C["gold"], width=2)
    return img

def make_acc_glasses():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 32, 32
    draw.rectangle([cx-8, cy-3, cx-3, cy+1], outline=(0, 40, 150, 255))
    draw.rectangle([cx+3, cy-3, cx+8, cy+1], outline=(0, 40, 150, 255))
    draw.line([(cx-3, cy-1), (cx+3, cy-1)], fill=(0, 40, 150, 255))
    draw.line([(cx-8, cy-1), (cx-10, cy)], fill=(0, 40, 150, 255))
    draw.line([(cx+8, cy-1), (cx+10, cy)], fill=(0, 40, 150, 255))
    return img

def make_acc_sunglasses():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 32, 32
    draw.rectangle([cx-9, cy-3, cx-3, cy+2], fill=(17, 17, 34, 220))
    draw.rectangle([cx+3, cy-3, cx+9, cy+2], fill=(17, 17, 34, 220))
    draw.line([(cx-3, cy-1), (cx+3, cy-1)], fill=(0, 20, 80, 255))
    draw.line([(cx-9, cy-1), (cx-11, cy+1)], fill=(0, 20, 80, 255))
    draw.line([(cx+9, cy-1), (cx+11, cy+1)], fill=(0, 20, 80, 255))
    draw.line([(cx-8, cy-3), (cx-3, cy-3)], fill=(0, 60, 180, 255))
    draw.line([(cx+3, cy-3), (cx+8, cy-3)], fill=(0, 60, 180, 255))
    return img

def make_acc_monocle():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 32, 32
    draw.arc([cx+2, cy-4, cx+10, cy+4], 0, 360, fill=(168, 216, 255, 255), width=1)
    draw.line([(cx+6, cy+4), (cx+8, cy+8)], fill=(168, 216, 255, 200))
    return img

def make_acc_bow():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx = 32
    draw.polygon([(cx-8, 16), (cx-3, 20), (cx-8, 24)], fill=(0, 82, 255, 255))
    draw.polygon([(cx+8, 16), (cx+3, 20), (cx+8, 24)], fill=(0, 82, 255, 255))
    draw.ellipse([cx-2, 18, cx+2, 22], fill=(0, 120, 255, 255))
    return img

def make_acc_scarf():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 32, 48
    draw.rectangle([cx-12, cy-2, cx+12, cy+2], fill=(0, 82, 255, 255))
    draw.rectangle([cx-2, cy-1, cx+2, cy+1], fill=(77, 140, 255, 255))
    draw.rectangle([cx+8, cy+2, cx+10, cy+8], fill=(0, 60, 200, 255))
    return img

def make_acc_antenna():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx = 32
    draw.line([(cx, 22), (cx+4, 10)], fill=(0, 60, 180, 255))
    draw.ellipse([cx+2, 8, cx+8, 14], fill=(0, 82, 255, 255))
    draw.ellipse([cx+3, 9, cx+7, 13], fill=(168, 216, 255, 255))
    return img

def make_acc_star_badge():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 42, 40
    pts = []
    for i in range(5):
        angle = math.radians(i * 72 - 90)
        pts.append((cx + 5*math.cos(angle), cy + 5*math.sin(angle)))
        angle2 = math.radians(i * 72 - 90 + 36)
        pts.append((cx + 2*math.cos(angle2), cy + 2*math.sin(angle2)))
    draw.polygon(pts, fill=C["gold"])
    return img

def make_acc_heart():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 42, 36
    draw.ellipse([cx-4, cy-3, cx, cy+1], fill=(77, 140, 255, 255))
    draw.ellipse([cx, cy-3, cx+4, cy+1], fill=(77, 140, 255, 255))
    draw.polygon([(cx-4, cy), (cx+4, cy), (cx, cy+5)], fill=(77, 140, 255, 255))
    return img

def make_acc_music():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 42, 36
    draw.text if False else None
    draw.ellipse([cx-3, cy+1, cx+1, cy+5], fill=(0, 82, 255, 255))
    draw.line([(cx+1, cy-4), (cx+1, cy+3)], fill=(0, 82, 255, 255))
    draw.line([(cx+1, cy-4), (cx+5, cy-2)], fill=(0, 82, 255, 255))
    draw.point((cx+3, cy), fill=(168, 216, 255, 200))
    return img

def make_acc_flame():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 43, 40
    draw.polygon([(cx, cy-8), (cx-3, cy), (cx+3, cy)], fill=(0, 82, 255, 255))
    draw.polygon([(cx, cy-5), (cx-2, cy+1), (cx+2, cy+1)], fill=(168, 216, 255, 220))
    return img

def make_acc_lightning():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 43, 35
    draw.polygon([(cx+2, cy), (cx-2, cy+5), (cx+1, cy+5), (cx-2, cy+10),
                  (cx+3, cy+4), (cx, cy+4)], fill=(255, 220, 0, 255))
    return img

def make_acc_flag():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 40, 26
    draw.line([(cx, cy), (cx, cy+16)], fill=(0, 40, 150, 255))
    draw.polygon([(cx, cy), (cx+10, cy+4), (cx, cy+8)], fill=(0, 82, 255, 255))
    draw.line([(cx+2, cy+3), (cx+8, cy+5)], fill=(168, 216, 255, 200))
    return img

def make_acc_gem():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 42, 32
    draw.polygon([(cx-4, cy), (cx, cy-5), (cx+4, cy),
                  (cx+3, cy+4), (cx-3, cy+4)], fill=(0, 200, 255, 255))
    draw.line([(cx-4, cy), (cx, cy-5), (cx+4, cy)], fill=(168, 255, 255, 255))
    draw.point((cx-1, cy-2), fill=(255, 255, 255, 220))
    return img

def make_acc_backpack():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 44, 36
    draw.rectangle([cx-4, cy-6, cx+4, cy+6], fill=(0, 40, 150, 255))
    draw.rectangle([cx-3, cy-4, cx+3, cy+4], fill=(0, 60, 180, 255))
    draw.rectangle([cx-1, cy-1, cx+1, cy+1], fill=(0, 82, 255, 255))
    draw.arc([cx-2, cy-6, cx+2, cy-3], 0, 180, fill=(0, 82, 255, 255), width=1)
    return img

def make_acc_camera():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 42, 40
    draw.rectangle([cx-5, cy-4, cx+5, cy+4], fill=(0, 30, 100, 255))
    draw.ellipse([cx-3, cy-3, cx+3, cy+3], fill=(0, 60, 180, 255))
    draw.ellipse([cx-2, cy-2, cx+2, cy+2], fill=(0, 82, 255, 200))
    draw.point((cx-4, cy-3), fill=(168, 216, 255, 200))
    return img

def make_acc_book():
    img = new_img()
    draw = ImageDraw.Draw(img)
    cx, cy = 42, 40
    draw.rectangle([cx-5, cy-5, cx+4, cy+5], fill=(0, 40, 150, 255))
    draw.rectangle([cx-4, cy-4, cx+3, cy+4], fill=(0, 60, 200, 255))
    draw.line([(cx-4, cy-4), (cx-4, cy+4)], fill=(0, 82, 255, 255))
    draw.line([(cx-2, cy-2), (cx+2, cy-2)], fill=(168, 216, 255, 150))
    draw.line([(cx-2, cy),   (cx+2, cy)],   fill=(168, 216, 255, 150))
    draw.line([(cx-2, cy+2), (cx+2, cy+2)], fill=(168, 216, 255, 150))
    return img

ACC_MAKERS = [
    make_acc_none, make_acc_tophat, make_acc_cap, make_acc_crown, make_acc_halo,
    make_acc_glasses, make_acc_sunglasses, make_acc_monocle, make_acc_bow, make_acc_scarf,
    make_acc_antenna, make_acc_star_badge, make_acc_heart, make_acc_music, make_acc_flame,
    make_acc_lightning, make_acc_flag, make_acc_gem, make_acc_backpack, make_acc_camera,
    make_acc_book,
]
ACC_NAMES = [
    "none", "tophat", "cap", "crown", "halo",
    "glasses", "sunglasses", "monocle", "bow", "scarf",
    "antenna", "star_badge", "heart", "music", "flame",
    "lightning", "flag", "gem", "backpack", "camera",
    "book",
]


# ══════════════════════════════════════════════════════════════
# メイン：全レイヤーを生成して保存
# ══════════════════════════════════════════════════════════════

BASE = os.path.dirname(__file__)

def run():
    print("=== ONe Layer Generator ===\n")

    print("[1] Backgrounds...")
    for name, maker in zip(BG_NAMES, BG_MAKERS):
        save(maker(), f"{BASE}/layers/01_background/{name}.png")

    print("\n[2+3] Body × Color combinations...")
    for shape_name in BODY_SHAPES:
        for color_name in BODY_COLORS:
            save(make_body_layer(shape_name, color_name),
                 f"{BASE}/layers/02_body/{shape_name}_{color_name}.png")

    print("\n[4] Loop rings...")
    for name, maker in zip(LOOP_NAMES, LOOP_MAKERS):
        save(maker(), f"{BASE}/layers/04_loop/{name}.png")

    print("\n[5] Expressions...")
    for name, maker in zip(EXPR_NAMES, EXPR_MAKERS):
        save(maker(), f"{BASE}/layers/05_expression/{name}.png")

    print("\n[6] Accessories...")
    for name, maker in zip(ACC_NAMES, ACC_MAKERS):
        save(maker(), f"{BASE}/layers/06_accessory/{name}.png")

    print("\n✅ All layers created!")

if __name__ == "__main__":
    run()
