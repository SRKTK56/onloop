"""各ステージのサンプルを並べたプレビュー画像を生成"""
from PIL import Image, ImageDraw
import os

BASE = os.path.dirname(__file__)

# 各ステージから代表的なトークンを選ぶ（ランダム分布なので探す）
import json

stage_samples = {}
for fname in sorted(os.listdir(f"{BASE}/output/metadata")):
    if not fname.endswith(".json"):
        continue
    with open(f"{BASE}/output/metadata/{fname}") as f:
        meta = json.load(f)
    stage = next(a["value"] for a in meta["attributes"] if a["trait_type"] == "Stage")
    if stage not in stage_samples:
        stage_samples[stage] = fname.replace(".json", "")

stages_order = ["VILLAGE", "TOWN", "JAPAN", "ASIA", "WEST", "WORLD", "EARTH", "SPACE"]
rarities = {
    "VILLAGE": "Common", "TOWN": "Common",
    "JAPAN": "Uncommon", "ASIA": "Uncommon",
    "WEST": "Rare", "WORLD": "Rare",
    "EARTH": "Epic", "SPACE": "Legendary",
}

CELL = 80
PAD = 8
LABEL_H = 20
COLS = 4
ROWS = 2

W = COLS * (CELL + PAD) + PAD
H = ROWS * (CELL + LABEL_H + PAD) + PAD

preview = Image.new("RGB", (W, H), (10, 10, 30))
draw = ImageDraw.Draw(preview)

for i, stage in enumerate(stages_order):
    col = i % COLS
    row = i // COLS
    x = PAD + col * (CELL + PAD)
    y = PAD + row * (CELL + LABEL_H + PAD)

    token_id = stage_samples.get(stage, "0001")
    nft = Image.open(f"{BASE}/output/images/{token_id}.png").convert("RGB")
    nft = nft.resize((CELL, CELL), Image.NEAREST)
    preview.paste(nft, (x, y))

    # label
    rarity = rarities[stage]
    colors = {
        "Common": (80, 140, 80),
        "Uncommon": (180, 160, 40),
        "Rare": (60, 100, 220),
        "Epic": (120, 60, 200),
        "Legendary": (180, 120, 0),
    }
    draw.rectangle([x, y+CELL, x+CELL, y+CELL+LABEL_H], fill=(5, 5, 20))
    draw.text((x+2, y+CELL+3), f"{stage}", fill=colors[rarity])
    draw.text((x+2, y+CELL+11), f"#{token_id}", fill=(60, 80, 120))

out_path = f"{BASE}/output/preview.png"
preview.save(out_path)
print(f"✅ Preview saved: {out_path}")
