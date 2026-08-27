"""
ONe NFT Collection v2 — pixel-perfect sprite generator
All pixels explicitly placed; no PIL anti-aliased drawing on characters.
"""
from PIL import Image
import math, random, os

SIZE = 64
BASE = os.path.dirname(__file__)

# ── Colors ────────────────────────────────────────────────────────────────────
TRANSPARENT = (0, 0, 0, 0)
OUTLINE_C   = (8,  8,  24, 255)
EYE_WHITE_C = (235, 245, 255, 255)
EYE_PUPIL_C = (8,  8,  24, 255)
EYE_SHINE_C = (255, 255, 255, 255)

BODY_COLS = {
    "base_blue": ((0,  82, 255), (90, 162, 255), (0,  42, 155)),
    "neon_blue":  ((60, 130, 255), (140, 190, 255), (30, 72, 200)),
    "ice_blue":   ((130, 195, 255), (205, 235, 255), (70, 135, 205)),
    "midnight":   ((0,  35, 145), (45, 95, 205), (0,  12, 80)),
}

RING_COL  = (77, 140, 255, 255)
RING_GLOW = (0, 82, 255, 80)

# ── Utilities ─────────────────────────────────────────────────────────────────
def new_img():
    return Image.new("RGBA", (SIZE, SIZE), TRANSPARENT)

def save(img, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "PNG")
    print(f"  saved: {os.path.basename(path)}")

def place_sprite(img, grid, ax, ay, cmap):
    """Blit a 2-D color-index grid at (ax,ay)."""
    for ry, row in enumerate(grid):
        for rx, val in enumerate(row):
            if val == 0:
                continue
            x, y = ax + rx, ay + ry
            if 0 <= x < SIZE and 0 <= y < SIZE:
                img.putpixel((x, y), cmap[val])

def body_set_ellipse(cx, cy, rx, ry):
    s = set()
    for y in range(SIZE):
        for x in range(SIZE):
            if ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1.0:
                s.add((x, y))
    return s

def body_set_octagon(cx, cy, r_main, r_diag):
    """Octagon: Manhattan + Chebyshev blend."""
    s = set()
    for y in range(SIZE):
        for x in range(SIZE):
            dx, dy = abs(x - cx), abs(y - cy)
            if dx <= r_main and dy <= r_main and dx + dy <= r_diag:
                s.add((x, y))
    return s

def body_set_fluffy(cx, cy, rx, ry):
    base = body_set_ellipse(cx, cy, rx, ry)
    bumps = []
    for angle in range(0, 360, 45):
        rad = math.radians(angle)
        bx = int(cx + (rx - 2) * math.cos(rad))
        by = int(cy + (ry - 2) * math.sin(rad))
        for dy in range(-3, 4):
            for dx in range(-3, 4):
                if dx * dx + dy * dy <= 9:
                    bumps.append((bx + dx, by + dy))
    return base | set(bumps)

def draw_body_set(body_set, main_c, hl_c, sh_c, cx, cy):
    img = new_img()
    for (x, y) in body_set:
        dx, dy = x - cx, y - cy
        if dx < -4 and dy < -5:
            col = hl_c
        elif dx > 4 and dy > 5:
            col = sh_c
        else:
            col = main_c
        img.putpixel((x, y), (*col, 255))
    # outline: 1px dark ring outside body
    for (x, y) in body_set:
        for odx, ody in ((-1,0),(1,0),(0,-1),(0,1)):
            nb = (x + odx, y + ody)
            if nb not in body_set and 0 <= nb[0] < SIZE and 0 <= nb[1] < SIZE:
                img.putpixel(nb, OUTLINE_C)
    return img


# ── Body layers ───────────────────────────────────────────────────────────────
CX, CY = 32, 40   # body center — leaves ~22px above for hats

def make_body(shape, color):
    main_c, hl_c, sh_c = BODY_COLS[color]
    if shape == "round":
        bs = body_set_ellipse(CX, CY, 15, 18)
    elif shape == "slim":
        bs = body_set_ellipse(CX, CY, 11, 21)
    elif shape == "fluffy":
        bs = body_set_fluffy(CX, CY, 13, 16)
    else:  # crystal
        bs = body_set_octagon(CX, CY, 14, 22)
    return draw_body_set(bs, main_c, hl_c, sh_c, CX, CY)


# ── Face sprite definitions ───────────────────────────────────────────────────
# Color index map shared by all face sprites
# 1=outline, 5=eye_white, 6=pupil, 7=shine
FACE_CMAP = {
    1: OUTLINE_C,
    5: EYE_WHITE_C,
    6: EYE_PUPIL_C,
    7: EYE_SHINE_C,
}

EYE_OPEN = [
    [0, 1, 1, 1, 1, 1, 0],
    [1, 5, 5, 5, 5, 5, 1],
    [1, 5, 5, 6, 6, 5, 1],
    [1, 5, 7, 6, 6, 5, 1],
    [0, 1, 5, 5, 5, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
]

EYE_WIDE = [
    [0, 1, 1, 1, 1, 1, 0],
    [1, 5, 5, 5, 5, 5, 1],
    [1, 5, 6, 6, 6, 5, 1],
    [1, 5, 7, 6, 6, 5, 1],
    [1, 5, 5, 5, 5, 5, 1],
    [0, 1, 1, 1, 1, 1, 0],
]

EYE_HALF = [  # sleepy / wink (closed-ish)
    [0, 1, 1, 1, 1, 1, 0],
    [1, 5, 5, 5, 5, 5, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
]

EYE_STAR = [  # sparkle
    [0, 0, 1, 0, 1, 0, 0],
    [0, 1, 7, 1, 7, 1, 0],
    [1, 7, 5, 7, 5, 7, 1],
    [0, 1, 7, 6, 7, 1, 0],
    [0, 0, 1, 7, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
]

EYE_WINK = [  # closed arc
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
]

def mirror_eye(grid):
    return [row[::-1] for row in grid]

# Eye anchor positions (top-left of 7×6 grid)
EYE_L = (22, 30)   # left eye
EYE_R = (36, 30)   # right eye

def _place_eyes(img, left_tmpl, right_tmpl):
    place_sprite(img, left_tmpl,  EYE_L[0], EYE_L[1], FACE_CMAP)
    place_sprite(img, right_tmpl, EYE_R[0], EYE_R[1], FACE_CMAP)

def _smile(img):
    for (x, y) in [(27,43),(28,44),(29,45),(30,46),(31,46),
                   (32,46),(33,46),(34,45),(35,44),(36,43)]:
        img.putpixel((x, y), OUTLINE_C)

def _flat_mouth(img):
    for x in range(27, 37):
        img.putpixel((x, 44), OUTLINE_C)

def _o_mouth(img):
    for (x, y) in [(29,43),(30,42),(31,42),(32,42),(33,42),(34,43),
                   (34,44),(34,45),(33,45),(32,45),(31,45),(30,45),
                   (29,44)]:
        img.putpixel((x, y), OUTLINE_C)

def _big_smile(img):
    for (x, y) in [(25,42),(26,43),(27,44),(28,45),(29,46),(30,47),
                   (31,47),(32,47),(33,47),(34,46),(35,45),(36,44),(37,43),(38,42)]:
        img.putpixel((x, y), OUTLINE_C)

def make_face(expr):
    img = new_img()
    if expr == "smile":
        _place_eyes(img, EYE_OPEN, mirror_eye(EYE_OPEN))
        _smile(img)
    elif expr == "serious":
        _place_eyes(img, EYE_OPEN, mirror_eye(EYE_OPEN))
        # brow crease
        for x in range(23, 28): img.putpixel((x, 29), OUTLINE_C)
        for x in range(37, 42): img.putpixel((x, 29), OUTLINE_C)
        _flat_mouth(img)
    elif expr == "surprised":
        _place_eyes(img, EYE_WIDE, mirror_eye(EYE_WIDE))
        _o_mouth(img)
    elif expr == "wink":
        _place_eyes(img, EYE_OPEN, EYE_WINK)
        _smile(img)
    elif expr == "sparkle":
        _place_eyes(img, EYE_STAR, mirror_eye(EYE_STAR))
        _big_smile(img)
    else:  # sleepy
        _place_eyes(img, EYE_HALF, mirror_eye(EYE_HALF))
        # zz
        for (x, y) in [(40,24),(41,24),(42,24),(42,25),(40,26),(41,26),(42,26)]:
            img.putpixel((x, y), (77, 140, 255, 200))
        _flat_mouth(img)
    return img


# ── Loop ring layers ──────────────────────────────────────────────────────────
RX, RY = 32, 52   # ring center (lower chest)

def _draw_ring(img, cx, cy, r, col, width=1):
    for angle in range(0, 360):
        rad = math.radians(angle)
        for w in range(width):
            x = int(cx + (r + w) * math.cos(rad))
            y = int(cy + (r + w) * math.sin(rad))
            if 0 <= x < SIZE and 0 <= y < SIZE:
                img.putpixel((x, y), col)

def make_ring(count):
    img = new_img()
    if count == 1:
        _draw_ring(img, RX, RY, 4, RING_COL)
        _draw_ring(img, RX, RY, 5, (*RING_GLOW[:3], 50))
        img.putpixel((RX, RY - 4), EYE_SHINE_C)
    elif count == 2:
        _draw_ring(img, RX, RY, 3, RING_COL)
        _draw_ring(img, RX, RY, 6, RING_COL)
        _draw_ring(img, RX, RY, 7, (*RING_GLOW[:3], 60))
        img.putpixel((RX, RY - 3), EYE_SHINE_C)
        img.putpixel((RX, RY - 6), EYE_SHINE_C)
    else:  # 3 rings — Legendary glow
        for r, alpha in [(2, 255), (5, 220), (8, 180)]:
            _draw_ring(img, RX, RY, r, (*RING_COL[:3], alpha))
        for r in [3, 6, 9]:
            _draw_ring(img, RX, RY, r, (*RING_GLOW[:3], 55))
        for (x, y) in [(RX, RY-2), (RX, RY-5), (RX, RY-8),
                       (RX-2, RY), (RX+2, RY)]:
            if 0 <= x < SIZE and 0 <= y < SIZE:
                img.putpixel((x, y), EYE_SHINE_C)
    return img


# ── Backgrounds ───────────────────────────────────────────────────────────────
def _gradient(img, top, bot):
    draw_data = img.load()
    for y in range(SIZE):
        t = y / (SIZE - 1)
        r = int(top[0] + t * (bot[0] - top[0]))
        g = int(top[1] + t * (bot[1] - top[1]))
        b = int(top[2] + t * (bot[2] - top[2]))
        for x in range(SIZE):
            draw_data[x, y] = (r, g, b, 255)

def _stars(img, n, col, seed):
    rng = random.Random(seed)
    px = img.load()
    for _ in range(n):
        x, y = rng.randint(0, 63), rng.randint(0, 40)
        a = rng.randint(120, 255)
        px[x, y] = (*col[:3], a)

def make_bg_village():
    img = new_img(); _gradient(img, (12,12,48), (8,18,45))
    _stars(img, 28, (168,216,255), 1)
    px = img.load()
    for y in range(50, 64):
        for x in range(64): px[x,y] = (4,8,28,255)
    # house silhouettes
    for hx, hw in [(2,12),(17,10),(32,13),(48,10),(56,8)]:
        for y in range(42, 52):
            for x in range(hx, hx+hw): px[x,y] = (0,20,80,255)
        # roof
        hy = 42; mid = hx + hw//2
        for row, width in enumerate([2,4,6,8,hw+2,hw+4]):
            for x in range(mid-width//2, mid+width//2):
                if 0<=x<64: px[x, hy-row] = (0,35,130,255)
        # window
        if hw > 8:
            for y in range(44,48):
                for x in range(hx+3,hx+6): px[x,y] = (0,80,220,255)
    return img

def make_bg_town():
    img = new_img(); _gradient(img, (6,6,30), (10,10,40))
    px = img.load()
    rng = random.Random(2)
    # rain
    for _ in range(35):
        x, y = rng.randint(0,63), rng.randint(0,55)
        for i in range(3):
            nx, ny = x-i, y+i
            if 0<=nx<64 and 0<=ny<64: px[nx,ny] = (60,100,220,60)
    # buildings
    for bx,bh,bw in [(0,32,10),(12,24,9),(23,38,12),(37,27,10),(49,20,8),(58,30,6)]:
        for y in range(64-bh,64):
            for x in range(bx,bx+bw): px[x,y] = (0,12,50,255)
        rng2 = random.Random(bx+1)
        for wy in range(64-bh+2, 62, 5):
            for wx in range(bx+1, bx+bw-1, 3):
                if rng2.random() > 0.35:
                    for dy in range(3):
                        for dx in range(2):
                            if 0<=wx+dx<64 and 0<=wy+dy<64:
                                px[wx+dx,wy+dy] = (0,80,255,210)
    return img

def make_bg_japan():
    img = new_img(); _gradient(img, (8,6,35), (12,10,48))
    _stars(img, 20, (200,220,255), 3)
    px = img.load()
    # Fuji
    pts = [(0,52),(32,20),(63,52)]
    # flood-fill triangle
    for y in range(20, 53):
        t = (y-20)/32
        lx = int(0 + t*32); rx = int(63 - t*32)
        for x in range(lx, rx+1): px[x,y] = (0,20,75,255)
    # snow cap
    for y in range(20,28):
        t = (y-20)/8
        lx = int(32 - t*8); rx = int(32 + t*8)
        for x in range(lx,rx+1): px[x,y] = (180,210,255,255)
    # torii
    for y in range(38,52):
        px[40,y] = (0,35,130,255); px[48,y] = (0,35,130,255)
    for x in range(38,51): px[x,38] = (0,35,130,255)
    for x in range(37,52): px[x,41] = (0,35,130,255)
    # water
    for y in range(53,64):
        for x in range(64): px[x,y] = (0,int(30+(y-53)*4),int(80+(y-53)*5),255)
    return img

def make_bg_asia():
    img = new_img(); _gradient(img, (10,6,38), (8,8,35))
    px = img.load()
    # lanterns
    for lx,ly in [(8,10),(20,14),(36,8),(50,12),(14,22),(44,20),(58,16)]:
        for dy in range(-5,6):
            for dx in range(-4,5):
                if dx*dx*36+dy*dy*25 <= 900:
                    if 0<=lx+dx<64 and 0<=ly+dy<64:
                        px[lx+dx,ly+dy] = (0,70,220,255)
        px[lx,ly-2] = (100,160,255,255)
        # string
        for y in range(ly-8,ly-5):
            if 0<=y<64: px[lx,y] = (0,40,140,255)
    # market floor
    for y in range(50,64):
        for x in range(64): px[x,y] = (4,6,25,255)
    return img

def make_bg_west():
    img = new_img(); _gradient(img, (5,5,28), (8,10,40))
    _stars(img, 18, (200,225,255), 5)
    px = img.load()
    # Statue of Liberty (simplified)
    for y in range(22,56):
        for x in range(28,37): px[x,y] = (0,18,72,255)
    for y in range(18,23):
        for x in range(26,39): px[x,y] = (0,18,72,255)
    for y in range(14,19):
        for x in range(28,37): px[x,y] = (0,18,72,255)
    for y in range(10,15):
        for x in range(30,35): px[x,y] = (0,18,72,255)
    # torch glow
    for dy in range(-3,4):
        for dx in range(-2,3):
            if 0<=32+dx<64 and 0<=8+dy<64:
                px[32+dx,8+dy] = (80,140,255,255)
    # city lights
    rng = random.Random(5)
    for _ in range(50):
        x = rng.randint(0,63); y = rng.randint(48,63)
        px[x,y] = (0,rng.randint(60,140),255,200)
    for y in range(56,64):
        for x in range(64): px[x,y] = (3,5,20,255)
    return img

def make_bg_world():
    img = new_img()
    _gradient(img, (4,4,20), (6,6,28))
    _stars(img, 30, (160,200,255), 6)
    px = img.load()
    cx2, cy2, r = 32, 36, 17
    for y in range(SIZE):
        for x in range(SIZE):
            if (x-cx2)**2+(y-cy2)**2 <= r*r:
                px[x,y] = (0,55,200,255)
    # continents (simple blobs)
    blobs = [(27,30,6,8),(36,28,7,6),(26,38,7,6),(40,36,5,7)]
    for bx,by,brx,bry in blobs:
        for y in range(SIZE):
            for x in range(SIZE):
                if ((x-bx)/brx)**2+((y-by)/bry)**2<=1 and (x-cx2)**2+(y-cy2)**2<r*r:
                    px[x,y] = (0,82,255,255)
    # atmosphere
    for angle in range(360):
        rad = math.radians(angle)
        x = int(cx2+(r+1)*math.cos(rad)); y = int(cy2+(r+1)*math.sin(rad))
        if 0<=x<64 and 0<=y<64: px[x,y] = (60,120,255,160)
    return img

def make_bg_earth():
    img = new_img(); _gradient(img, (3,3,15), (5,5,22))
    _stars(img, 45, (255,255,255), 7)
    _stars(img, 15, (100,160,255), 71)
    px = img.load()
    # Earth arc at bottom
    for y in range(46,64):
        for x in range(64):
            if (x-32)**2+(y-70)**2 <= 38**2:
                px[x,y] = (0,60,210,255)
    # cloud wisps
    for cx2,cy2,rr in [(15,50,8),(40,47,10),(55,52,7)]:
        for y in range(SIZE):
            for x in range(SIZE):
                if ((x-cx2)/rr)**2+((y-cy2)/(rr//2))**2<=1:
                    if px[x,y][3]>0:
                        px[x,y] = (80,140,255,255)
    return img

def make_bg_space():
    img = new_img(); _gradient(img, (2,2,12), (4,4,18))
    _stars(img, 55, (255,255,255), 8)
    _stars(img, 20, (100,160,255), 81)
    _stars(img, 8,  (255,220,100), 82)
    px = img.load()
    # nebula glow patches
    rng = random.Random(88)
    for _ in range(6):
        nx, ny = rng.randint(5,59), rng.randint(5,55)
        for dy in range(-10,11):
            for dx in range(-14,15):
                if dx*dx*4+dy*dy*9 <= 900:
                    ox, oy = nx+dx, ny+dy
                    if 0<=ox<64 and 0<=oy<64:
                        cur = px[ox,oy]
                        px[ox,oy] = (min(255,cur[0]+8), min(255,cur[1]+18), min(255,cur[2]+35), 255)
    # big bright star
    for (x,y) in [(50,10),(49,10),(51,10),(50,9),(50,11)]:
        px[x,y] = (255,255,255,255)
    return img

BG_MAP = {
    "village": make_bg_village, "town": make_bg_town,
    "japan": make_bg_japan,     "asia": make_bg_asia,
    "west":  make_bg_west,      "world": make_bg_world,
    "earth": make_bg_earth,     "space": make_bg_space,
}


# ── Accessories ───────────────────────────────────────────────────────────────
# All accessories placed with anchor relative to top of body (hat area) or chest.
# anchor_y ≈ 14 for hat-top, 36 for chest items.

def _acc(grid, ax, ay, cmap):
    img = new_img()
    place_sprite(img, grid, ax, ay, cmap)
    return img

# color shortcuts
B = (0,82,255,255); D = (0,20,90,255); N = (77,140,255,255)
G = (255,215,0,255); W2= (240,248,255,255); K = OUTLINE_C
I = (168,216,255,255); T = (180,80,0,255); R2=(200,50,50,255)

def make_acc_none():
    return new_img()

def make_acc_tophat():
    grid = [
        [0,0,K,K,K,K,K,K,K,K,K,0,0],
        [0,0,K,D,D,D,D,D,D,D,K,0,0],
        [0,0,K,D,D,D,D,D,D,D,K,0,0],
        [0,0,K,D,D,D,D,D,D,D,K,0,0],
        [0,0,K,D,D,N,N,N,D,D,K,0,0],
        [K,K,K,K,K,K,K,K,K,K,K,K,K],
        [K,D,D,D,D,D,D,D,D,D,D,D,K],
    ]
    return _acc(grid, 26, 12, {K:K, D:D, N:N})

def make_acc_cap():
    grid = [
        [0,0,0,K,K,K,K,K,K,K,0,0,0],
        [0,0,K,B,B,B,B,B,B,B,K,0,0],
        [0,K,B,B,I,I,I,B,B,B,B,K,0],
        [K,B,B,B,I,B,B,B,B,B,B,B,K],
        [K,D,D,D,D,D,D,D,D,D,D,D,K],
        [0,K,K,K,K,K,K,K,K,K,K,K,0],
        [0,0,0,0,K,K,K,K,K,0,0,0,0],
    ]
    return _acc(grid, 26, 13, {K:K, B:B, I:I, D:D})

def make_acc_crown():
    grid = [
        [K,0,0,K,0,0,K,0,0,K,0,0,K],
        [K,K,0,K,K,0,K,K,0,K,K,0,K],
        [K,G,K,K,G,K,K,G,K,K,G,K,K],
        [K,G,G,G,G,G,G,G,G,G,G,G,K],
        [K,G,G,G,G,G,G,G,G,G,G,G,K],
        [K,K,K,K,K,K,K,K,K,K,K,K,K],
    ]
    return _acc(grid, 26, 13, {K:K, G:G})

def make_acc_halo():
    img = new_img()
    px = img.load()
    cx2 = 32
    for angle in range(360):
        rad = math.radians(angle)
        for r in range(7, 10):
            x = int(cx2 + r*math.cos(rad))
            y = int(16  + (r//3)*math.sin(rad))
            if 0<=x<64 and 0<=y<64:
                alpha = 255 - (r-7)*60
                px[x,y] = (*G[:3], alpha)
    return img

def make_acc_glasses():
    grid = [
        [K,K,K,K,0,K,0,K,K,K,K],
        [K,W2,W2,K,K,K,K,W2,W2,K],
        [K,W2,W2,K,0,K,0,W2,W2,K],
        [K,K,K,K,0,0,0,K,K,K,K],
        [D,0,0,0,0,0,0,0,0,0,D ],
    ]
    return _acc(grid, 27, 31, {K:K, W2:W2, D:D})

def make_acc_sunglasses():
    grid = [
        [K,K,K,K,K,0,K,K,K,K,K],
        [K,K,K,K,K,K,K,K,K,K,K],
        [K,K,K,K,K,0,K,K,K,K,K],
        [K,K,K,K,0,0,0,K,K,K,K],
        [D,0,0,0,0,0,0,0,0,0,D],
    ]
    return _acc(grid, 27, 31, {K:K, D:D})

def make_acc_monocle():
    grid = [
        [0,K,K,K,0],
        [K,W2,W2,W2,K],
        [K,W2,K,W2,K],
        [0,K,K,K,0],
        [0,0,K,0,0],
        [0,0,K,0,0],
    ]
    return _acc(grid, 38, 31, {K:K, W2:W2})

def make_acc_bow():
    grid = [
        [K,D,0,0,K,0,0,D,K],
        [D,D,K,K,D,K,K,D,D],
        [K,D,B,K,D,K,B,D,K],
        [D,D,K,K,D,K,K,D,D],
        [K,D,0,0,K,0,0,D,K],
    ]
    return _acc(grid, 28, 16, {K:K, D:D, B:B})

def make_acc_scarf():
    img = new_img(); px = img.load()
    for y in range(52,56):
        for x in range(18,46): px[x,y] = B[:3] + (255,)
    for y in range(52,56):
        for x in range(20,24): px[x,y] = I[:3] + (255,)
    for y in range(54,62):
        for x in range(40,44): px[x,y] = D[:3] + (255,)
    for x in range(18,46): px[x,52] = K[:3]+(255,)
    for x in range(18,46): px[x,55] = K[:3]+(255,)
    return img

def make_acc_antenna():
    grid = [
        [0,0,K,K,K,0,0],
        [0,0,K,N,K,0,0],
        [0,0,K,N,K,0,0],
        [0,0,0,K,0,0,0],
        [0,0,0,K,0,0,0],
        [0,0,0,K,0,0,0],
    ]
    return _acc(grid, 30, 8, {K:K, N:N})

def make_acc_star():
    img = new_img(); px = img.load()
    cx2, cy2 = 44, 36
    for i in range(5):
        a1 = math.radians(i*72-90)
        a2 = math.radians(i*72-90+36)
        x1,y1 = int(cx2+6*math.cos(a1)), int(cy2+6*math.sin(a1))
        x2,y2 = int(cx2+3*math.cos(a2)), int(cy2+3*math.sin(a2))
        for t10 in range(11):
            t = t10/10
            x = int(cx2 + t*(x1-cx2)); y = int(cy2 + t*(y1-cy2))
            if 0<=x<64 and 0<=y<64: px[x,y] = G[:3]+(255,)
            x = int(x1 + t*(x2-x1)); y = int(y1 + t*(y2-y1))
            if 0<=x<64 and 0<=y<64: px[x,y] = G[:3]+(255,)
    return img

def make_acc_heart():
    grid = [
        [0,K,K,0,K,K,0],
        [K,B,B,K,B,B,K],
        [K,B,B,B,B,B,K],
        [0,K,B,B,B,K,0],
        [0,0,K,B,K,0,0],
        [0,0,0,K,0,0,0],
    ]
    return _acc(grid, 39, 32, {K:K, B:N})

def make_acc_music():
    grid = [
        [0,K,K,K,0],
        [0,K,B,K,0],
        [0,K,0,0,0],
        [0,K,0,0,0],
        [K,K,K,0,0],
        [K,B,K,0,0],
        [0,K,0,0,0],
    ]
    return _acc(grid, 39, 34, {K:K, B:B})

def make_acc_flame():
    grid = [
        [0,0,K,0,0],
        [0,K,N,K,0],
        [K,B,N,B,K],
        [K,B,B,B,K],
        [K,B,W2,B,K],
        [0,K,K,K,0],
    ]
    return _acc(grid, 40, 34, {K:K, B:B, N:N, W2:W2})

def make_acc_lightning():
    grid = [
        [0,0,G,G,0],
        [0,G,G,0,0],
        [G,G,G,G,0],
        [0,0,G,G,0],
        [0,G,G,0,0],
    ]
    return _acc(grid, 41, 34, {G:G})

def make_acc_flag():
    grid = [
        [K,B,B,B,B,B,B],
        [K,B,I,I,I,B,K],
        [K,B,B,B,B,K,0],
        [K,0,0,0,0,0,0],
        [K,0,0,0,0,0,0],
        [K,0,0,0,0,0,0],
    ]
    return _acc(grid, 40, 26, {K:K, B:B, I:I})

def make_acc_gem():
    grid = [
        [0,K,K,K,K,K,0],
        [K,I,N,N,N,I,K],
        [K,N,B,B,B,N,K],
        [0,K,N,B,N,K,0],
        [0,0,K,N,K,0,0],
        [0,0,0,K,0,0,0],
    ]
    return _acc(grid, 40, 33, {K:K, I:I, N:N, B:B})

def make_acc_backpack():
    grid = [
        [0,K,K,K,K,K,0],
        [K,D,D,D,D,D,K],
        [K,D,K,K,K,D,K],
        [K,D,K,B,K,D,K],
        [K,D,K,K,K,D,K],
        [K,D,D,D,D,D,K],
        [0,K,K,K,K,K,0],
    ]
    return _acc(grid, 44, 34, {K:K, D:D, B:B})

def make_acc_camera():
    grid = [
        [0,K,K,K,K,K,K,K,0],
        [K,K,D,D,D,D,D,K,K],
        [K,D,D,N,N,N,D,D,K],
        [K,D,N,B,I,N,N,D,K],
        [K,D,D,N,N,N,D,D,K],
        [0,K,K,D,D,D,K,K,0],
    ]
    return _acc(grid, 38, 35, {K:K, D:D, N:N, B:B, I:I})

def make_acc_book():
    grid = [
        [K,K,K,K,K,K,K,K],
        [K,D,D,D,D,D,D,K],
        [K,B,I,I,I,I,D,K],
        [K,B,I,I,I,I,D,K],
        [K,B,I,I,I,I,D,K],
        [K,B,I,I,I,I,D,K],
        [K,D,D,D,D,D,D,K],
        [0,K,K,K,K,K,K,0],
    ]
    return _acc(grid, 41, 34, {K:K, D:D, B:B, I:I})

ACC_MAP = {
    "none": make_acc_none, "tophat": make_acc_tophat, "cap": make_acc_cap,
    "crown": make_acc_crown, "halo": make_acc_halo,
    "glasses": make_acc_glasses, "sunglasses": make_acc_sunglasses,
    "monocle": make_acc_monocle, "bow": make_acc_bow, "scarf": make_acc_scarf,
    "antenna": make_acc_antenna, "star": make_acc_star, "heart": make_acc_heart,
    "music": make_acc_music, "flame": make_acc_flame, "lightning": make_acc_lightning,
    "flag": make_acc_flag, "gem": make_acc_gem, "backpack": make_acc_backpack,
    "camera": make_acc_camera, "book": make_acc_book,
}

BODY_SHAPES = ["round", "slim", "fluffy", "crystal"]
BODY_COLORS = list(BODY_COLS.keys())
EXPRESSIONS  = ["smile","serious","surprised","wink","sparkle","sleepy"]
RING_COUNTS  = [1, 2, 3]
BG_NAMES     = list(BG_MAP.keys())
ACC_NAMES    = list(ACC_MAP.keys())


# ── Main ──────────────────────────────────────────────────────────────────────
def run():
    L = f"{BASE}/layers"
    print("=== ONe Layer Generator v2 ===\n")

    print("[BG] Backgrounds...")
    for name, fn in BG_MAP.items():
        save(fn(), f"{L}/01_background/{name}.png")

    print("\n[BODY] Body × Color...")
    for shape in BODY_SHAPES:
        for color in BODY_COLORS:
            save(make_body(shape, color), f"{L}/02_body/{shape}_{color}.png")

    print("\n[RING] Loop rings...")
    for n in RING_COUNTS:
        save(make_ring(n), f"{L}/04_loop/loop_{n}.png")

    print("\n[FACE] Expressions...")
    for expr in EXPRESSIONS:
        save(make_face(expr), f"{L}/05_expression/{expr}.png")

    print("\n[ACC] Accessories...")
    for name, fn in ACC_MAP.items():
        save(fn(), f"{L}/06_accessory/{name}.png")

    print("\n✅ Done!")

if __name__ == "__main__":
    run()
