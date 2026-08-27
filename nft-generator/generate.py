"""
ONe NFT コレクション — 500枚生成スクリプト
レイヤーを合成してimage + metadataを出力する
"""
from PIL import Image
import json, random, os

BASE    = os.path.dirname(__file__)
OUT_IMG = os.path.join(BASE, "output/images")
OUT_META= os.path.join(BASE, "output/metadata")
os.makedirs(OUT_IMG,  exist_ok=True)
os.makedirs(OUT_META, exist_ok=True)

# ── レアリティ設定（ステージ別・枚数固定） ──────────────────
STAGES = [
    {"id": 1, "name": "村",    "nameEn": "VILLAGE", "rarity": "Common",    "bg": "village", "count": 110},
    {"id": 2, "name": "街",    "nameEn": "TOWN",    "rarity": "Common",    "bg": "town",    "count": 90 },
    {"id": 3, "name": "日本",  "nameEn": "JAPAN",   "rarity": "Uncommon",  "bg": "japan",   "count": 80 },
    {"id": 4, "name": "アジア","nameEn": "ASIA",    "rarity": "Uncommon",  "bg": "asia",    "count": 65 },
    {"id": 5, "name": "欧米",  "nameEn": "WEST",    "rarity": "Rare",      "bg": "west",    "count": 55 },
    {"id": 6, "name": "世界",  "nameEn": "WORLD",   "rarity": "Rare",      "bg": "world",   "count": 45 },
    {"id": 7, "name": "地球",  "nameEn": "EARTH",   "rarity": "Epic",      "bg": "earth",   "count": 30 },
    {"id": 8, "name": "宇宙",  "nameEn": "SPACE",   "rarity": "Legendary", "bg": "space",   "count": 25 },
]

# ループリングはレアリティに連動
RARITY_TO_LOOP = {
    "Common":    ["loop_1"],
    "Uncommon":  ["loop_1", "loop_2"],
    "Rare":      ["loop_2"],
    "Epic":      ["loop_2", "loop_3"],
    "Legendary": ["loop_3"],
}

BODY_SHAPES = ["round", "slim", "fluffy", "crystal"]
BODY_COLORS = ["base_blue", "neon_blue", "ice_blue", "midnight"]

EXPRESSIONS = ["smile", "serious", "surprised", "wink", "sparkle", "sleepy"]

ACCESSORIES = [
    "none", "tophat", "cap", "crown", "halo",
    "glasses", "sunglasses", "monocle", "bow", "scarf",
    "antenna", "star_badge", "heart", "music", "flame",
    "lightning", "flag", "gem", "backpack", "camera", "book",
]
ACC_WEIGHTS = [
    15, 5, 6, 3, 3,    # none, tophat, cap, crown, halo
     6, 5, 4, 5, 5,    # glasses, sunglasses, monocle, bow, scarf
     4, 4, 5, 4, 4,    # antenna, star_badge, heart, music, flame
     4, 4, 4, 4, 5, 5, # lightning, flag, gem, backpack, camera, book
]

def load(path):
    return Image.open(path).convert("RGBA")

def compose(layers):
    base = layers[0].copy()
    for layer in layers[1:]:
        base = Image.alpha_composite(base, layer)
    return base

def random_choice(options, weights=None):
    if weights:
        total = sum(weights)
        r = random.random() * total
        acc = 0
        for opt, w in zip(options, weights):
            acc += w
            if r <= acc:
                return opt
    return random.choice(options)

def make_metadata(token_id, traits, stage):
    return {
        "name":        f"ONe #{token_id:04d}",
        "description": "ONe (オーネ) — 恩送りの精霊。Baseチェーン上に宿る、kindnessの化身。",
        "image":       f"ipfs://PLACEHOLDER_CID/images/{token_id:04d}.png",
        "attributes": [
            {"trait_type": "Stage",      "value": stage["nameEn"]},
            {"trait_type": "World",      "value": stage["name"]},
            {"trait_type": "Rarity",     "value": stage["rarity"]},
            {"trait_type": "Body",       "value": traits["body"].replace("_", " ").title()},
            {"trait_type": "Color",      "value": traits["color"].replace("_", " ").title()},
            {"trait_type": "Loop Rings", "value": traits["loop"].replace("loop_", "") + " ring(s)"},
            {"trait_type": "Expression", "value": traits["expr"].title()},
            {"trait_type": "Accessory",  "value": traits["acc"].replace("_", " ").title()},
        ]
    }

def generate():
    random.seed(42)  # 再現可能な生成のため

    # ── トークンIDのシャッフルリストを生成（ランダム出現のため） ──
    token_ids = list(range(1, 501))
    random.shuffle(token_ids)

    # ── ステージ別にトークンIDを割り当て ──
    stage_token_map = []
    idx = 0
    for stage in STAGES:
        for _ in range(stage["count"]):
            stage_token_map.append((token_ids[idx], stage))
            idx += 1

    # tokenId順にソート（0001.png〜0500.pngが各ステージにランダムに対応する）
    stage_token_map.sort(key=lambda x: x[0])

    print(f"=== ONe Collection Generator ===")
    print(f"Total: {len(stage_token_map)} NFTs\n")

    duplicates_check = set()

    for token_id, stage in stage_token_map:
        body  = random.choice(BODY_SHAPES)
        color = random.choice(BODY_COLORS)
        loop  = random.choice(RARITY_TO_LOOP[stage["rarity"]])
        expr  = random.choice(EXPRESSIONS)
        acc   = random_choice(ACCESSORIES, ACC_WEIGHTS)

        trait_key = f"{stage['bg']}_{body}_{color}_{loop}_{expr}_{acc}"

        layers = [
            load(f"{BASE}/layers/01_background/{stage['bg']}.png"),
            load(f"{BASE}/layers/02_body/{body}_{color}.png"),
            load(f"{BASE}/layers/04_loop/{loop}.png"),
            load(f"{BASE}/layers/05_expression/{expr}.png"),
            load(f"{BASE}/layers/06_accessory/{acc}.png"),
        ]
        img = compose(layers)

        img_path  = f"{OUT_IMG}/{token_id:04d}.png"
        meta_path = f"{OUT_META}/{token_id:04d}.json"

        img.save(img_path, "PNG")

        traits = {"body": body, "color": color, "loop": loop, "expr": expr, "acc": acc}
        meta = make_metadata(token_id, traits, stage)
        with open(meta_path, "w", encoding="utf-8") as f:
            json.dump(meta, f, ensure_ascii=False, indent=2)

        duplicates_check.add(trait_key)

        if token_id % 50 == 0 or token_id <= 5:
            print(f"  #{token_id:04d} [{stage['rarity']:9s}] {stage['nameEn']:7s} | "
                  f"{body:7s} {color:10s} {loop} {expr:9s} {acc}")

    print(f"\n✅ Generated {len(stage_token_map)} NFTs")
    print(f"   Unique trait combos: {len(duplicates_check)} / {len(stage_token_map)}")
    print(f"   Images  → {OUT_IMG}/")
    print(f"   Metadata→ {OUT_META}/")

    # ── ステージ分布レポート ──
    print("\n── Stage Distribution ──")
    for stage in STAGES:
        print(f"  Stage {stage['id']} {stage['nameEn']:7s} [{stage['rarity']:9s}]: {stage['count']} pieces")

if __name__ == "__main__":
    generate()
