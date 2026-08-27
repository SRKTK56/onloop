import sharp from "sharp"
import { writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, "../public/characters")

// ── カラーパレット ──
const sk = "#f5c19a"  // 肌
const ey = "#1a1a1a"  // 目
const mo = "#c04040"  // 口
const bk = "#0a0a0a"  // 黒
const wh = "#f0f0f0"  // 白

// 1. 勇者（青）
const HERO = [
  [null,"#3d2000","#3d2000","#3d2000","#3d2000",null,null,null],
  ["#3d2000","#5d3010","#5d3010","#5d3010","#5d3010","#3d2000",null,null],
  [null,sk,sk,sk,sk,sk,null,null],
  [null,sk,ey,sk,sk,ey,sk,null],
  [null,sk,sk,mo,mo,sk,sk,null],
  [null,"#0052FF","#0052FF","#0052FF","#0052FF","#0052FF","#0052FF",null],
  ["#0052FF","#0052FF","#0052FF","#0052FF","#0052FF","#0052FF","#0052FF","#0052FF"],
  ["#0052FF","#0052FF","#003db5","#0052FF","#0052FF","#003db5","#0052FF","#0052FF"],
  [null,"#003db5","#003db5","#003db5","#003db5","#003db5","#003db5",null],
  [null,"#1a1a4a","#1a1a4a",null,null,"#1a1a4a","#1a1a4a",null],
  [null,"#1a1a4a","#1a1a4a",null,null,"#1a1a4a","#1a1a4a",null],
  [null,bk,bk,null,null,bk,bk,null],
]

// 2. 戦士（赤）
const WARRIOR = [
  [null,"#b45309","#b45309","#b45309","#b45309","#b45309",null,null],
  ["#b45309","#b45309",null,null,null,"#b45309","#b45309",null],
  [null,sk,sk,sk,sk,sk,sk,null],
  [null,sk,ey,sk,sk,ey,sk,null],
  [null,sk,sk,mo,mo,sk,sk,null],
  [null,"#e63946","#e63946","#e63946","#e63946","#e63946","#e63946",null],
  ["#e63946","#e63946","#e63946","#e63946","#e63946","#e63946","#e63946","#e63946"],
  ["#c0392b","#e63946","#c0392b","#e63946","#e63946","#c0392b","#e63946","#c0392b"],
  [null,"#c0392b","#c0392b","#c0392b","#c0392b","#c0392b","#c0392b",null],
  [null,"#4a1010","#4a1010",null,null,"#4a1010","#4a1010",null],
  [null,"#4a1010","#4a1010",null,null,"#4a1010","#4a1010",null],
  [null,bk,bk,null,null,bk,bk,null],
]

// 3. 魔法使い（紫）
const MAGE = [
  [null,null,"#6a0dad","#6a0dad","#6a0dad",null,null,null],
  [null,"#8b5cf6","#8b5cf6","#8b5cf6","#8b5cf6","#8b5cf6",null,null],
  [null,sk,sk,sk,sk,sk,sk,null],
  [null,sk,ey,sk,sk,ey,sk,null],
  [null,sk,sk,mo,mo,sk,sk,null],
  [null,"#6a0dad","#6a0dad","#6a0dad","#6a0dad","#6a0dad","#6a0dad",null],
  ["#6a0dad","#6a0dad","#9333ea","#6a0dad","#6a0dad","#9333ea","#6a0dad","#6a0dad"],
  ["#6a0dad","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#6a0dad"],
  [null,"#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea",null],
  [null,"#4a0080","#4a0080",null,null,"#4a0080","#4a0080",null],
  [null,"#4a0080","#4a0080",null,null,"#4a0080","#4a0080",null],
  [null,bk,bk,null,null,bk,bk,null],
]

// 4. 村人（緑）
const VILLAGER = [
  [null,null,"#5d3010","#5d3010","#5d3010",null,null,null],
  [null,"#5d3010","#5d3010","#5d3010","#5d3010","#5d3010",null,null],
  [null,sk,sk,sk,sk,sk,sk,null],
  [null,sk,ey,sk,sk,ey,sk,null],
  [null,sk,sk,mo,mo,sk,sk,null],
  [null,"#2d6a4f","#2d6a4f","#2d6a4f","#2d6a4f","#2d6a4f","#2d6a4f",null],
  ["#2d6a4f","#2d6a4f","#52b788","#2d6a4f","#2d6a4f","#52b788","#2d6a4f","#2d6a4f"],
  ["#2d6a4f","#52b788","#52b788","#52b788","#52b788","#52b788","#52b788","#2d6a4f"],
  [null,"#52b788","#52b788","#52b788","#52b788","#52b788","#52b788",null],
  [null,"#1b4332","#1b4332",null,null,"#1b4332","#1b4332",null],
  [null,"#1b4332","#1b4332",null,null,"#1b4332","#1b4332",null],
  [null,bk,bk,null,null,bk,bk,null],
]

// 5. 弓使い（黄緑）
const ARCHER = [
  [null,null,"#3a5c10","#3a5c10","#3a5c10",null,null,null],
  [null,"#4a7c18","#4a7c18","#4a7c18","#4a7c18","#4a7c18","#4a7c18",null],
  [null,sk,sk,sk,sk,sk,sk,null],
  [null,sk,ey,sk,sk,ey,sk,null],
  [null,sk,sk,mo,mo,sk,sk,null],
  [null,"#4a7c18","#84cc16","#4a7c18","#4a7c18","#84cc16","#4a7c18",null],
  ["#4a7c18","#84cc16","#84cc16","#84cc16","#84cc16","#84cc16","#84cc16","#4a7c18"],
  ["#4a7c18","#84cc16","#4a7c18","#84cc16","#84cc16","#4a7c18","#84cc16","#4a7c18"],
  [null,"#84cc16","#84cc16","#84cc16","#84cc16","#84cc16","#84cc16",null],
  [null,"#3a5c10","#3a5c10",null,null,"#3a5c10","#3a5c10",null],
  [null,"#3a5c10","#3a5c10",null,null,"#3a5c10","#3a5c10",null],
  [null,bk,bk,null,null,bk,bk,null],
]

// 6. 僧侶（ゴールド）
const PRIEST = [
  [null,null,"#b8860b","#b8860b","#b8860b",null,null,null],
  [null,"#f5c542","#f5c542","#f5c542","#f5c542","#f5c542",null,null],
  [null,sk,sk,sk,sk,sk,sk,null],
  [null,sk,ey,sk,sk,ey,sk,null],
  [null,sk,sk,mo,mo,sk,sk,null],
  [null,wh,"#f5c542",wh,wh,"#f5c542",wh,null],
  [wh,wh,"#f5c542",wh,wh,"#f5c542",wh,wh],
  [wh,"#f5c542","#f5c542","#f5c542","#f5c542","#f5c542","#f5c542",wh],
  [null,"#f5c542","#f5c542","#f5c542","#f5c542","#f5c542","#f5c542",null],
  [null,wh,wh,null,null,wh,wh,null],
  [null,wh,wh,null,null,wh,wh,null],
  [null,bk,bk,null,null,bk,bk,null],
]

// 7. 忍者（ダークスレート・赤目）
const NINJA = [
  [null,"#1e293b","#1e293b","#1e293b","#1e293b","#1e293b",null,null],
  [null,"#334155","#334155","#334155","#334155","#334155","#334155",null],
  [null,"#334155","#334155","#334155","#334155","#334155","#334155",null],
  [null,"#334155","#ff4444","#334155","#334155","#ff4444","#334155",null],
  [null,"#334155","#334155","#334155","#334155","#334155","#334155",null],
  [null,"#475569","#64748b","#475569","#475569","#64748b","#475569",null],
  ["#475569","#475569","#64748b","#475569","#475569","#64748b","#475569","#475569"],
  ["#475569","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#475569"],
  [null,"#64748b","#64748b","#64748b","#64748b","#64748b","#64748b",null],
  [null,"#1e293b","#1e293b",null,null,"#1e293b","#1e293b",null],
  [null,"#1e293b","#1e293b",null,null,"#1e293b","#1e293b",null],
  [null,bk,bk,null,null,bk,bk,null],
]

// 8. 騎士（シルバー）
const KNIGHT = [
  [null,"#64748b","#94a3b8","#94a3b8","#94a3b8","#64748b",null,null],
  ["#64748b","#94a3b8","#94a3b8","#94a3b8","#94a3b8","#94a3b8","#64748b",null],
  [null,"#94a3b8","#94a3b8","#94a3b8","#94a3b8","#94a3b8","#94a3b8",null],
  [null,"#64748b",ey,"#94a3b8","#94a3b8",ey,"#64748b",null],
  [null,"#94a3b8","#94a3b8","#94a3b8","#94a3b8","#94a3b8","#94a3b8",null],
  [null,"#64748b","#94a3b8","#cbd5e1","#cbd5e1","#94a3b8","#64748b",null],
  ["#64748b","#94a3b8","#64748b","#cbd5e1","#cbd5e1","#64748b","#94a3b8","#64748b"],
  ["#64748b","#cbd5e1","#cbd5e1","#cbd5e1","#cbd5e1","#cbd5e1","#cbd5e1","#64748b"],
  [null,"#94a3b8","#64748b","#94a3b8","#94a3b8","#64748b","#94a3b8",null],
  [null,"#475569","#475569",null,null,"#475569","#475569",null],
  [null,"#475569","#475569",null,null,"#475569","#475569",null],
  [null,bk,bk,null,null,bk,bk,null],
]

// 9. 賢者（ティール）
const SAGE = [
  [null,null,"#0d7a6e","#0d7a6e","#0d7a6e",null,null,null],
  [null,"#0d7a6e","#14b8a6","#14b8a6","#14b8a6","#0d7a6e",null,null],
  [null,sk,sk,sk,sk,sk,sk,null],
  [null,sk,ey,sk,sk,ey,sk,null],
  [null,sk,sk,mo,mo,sk,sk,null],
  [null,"#0d7a6e","#14b8a6","#14b8a6","#14b8a6","#14b8a6","#0d7a6e",null],
  ["#0d7a6e","#14b8a6","#2dd4bf","#14b8a6","#14b8a6","#2dd4bf","#14b8a6","#0d7a6e"],
  ["#0d7a6e","#2dd4bf","#2dd4bf","#2dd4bf","#2dd4bf","#2dd4bf","#2dd4bf","#0d7a6e"],
  [null,"#2dd4bf","#14b8a6","#2dd4bf","#2dd4bf","#14b8a6","#2dd4bf",null],
  [null,"#0d7a6e","#0d7a6e",null,null,"#0d7a6e","#0d7a6e",null],
  [null,"#0d7a6e","#0d7a6e",null,null,"#0d7a6e","#0d7a6e",null],
  [null,bk,bk,null,null,bk,bk,null],
]

// 10. 商人（オレンジ）
const MERCHANT = [
  [null,"#c2410c","#c2410c","#c2410c","#c2410c","#c2410c",null,null],
  ["#c2410c","#f97316","#f97316","#f97316","#f97316","#f97316","#c2410c",null],
  [null,sk,sk,sk,sk,sk,sk,null],
  [null,sk,ey,sk,sk,ey,sk,null],
  [null,sk,sk,mo,mo,sk,sk,null],
  [null,"#f97316","#f97316","#f97316","#f97316","#f97316","#f97316",null],
  ["#f97316","#f97316","#fb923c","#f97316","#f97316","#fb923c","#f97316","#f97316"],
  ["#f97316","#fb923c","#fb923c","#fb923c","#fb923c","#fb923c","#fb923c","#f97316"],
  [null,"#fb923c","#fb923c","#fb923c","#fb923c","#fb923c","#fb923c",null],
  [null,"#c2410c","#c2410c",null,null,"#c2410c","#c2410c",null],
  [null,"#c2410c","#c2410c",null,null,"#c2410c","#c2410c",null],
  [null,bk,bk,null,null,bk,bk,null],
]

const CHARS = [
  { key: "hero",     grid: HERO,     accent: "#0052FF" },
  { key: "warrior",  grid: WARRIOR,  accent: "#e63946" },
  { key: "mage",     grid: MAGE,     accent: "#9333ea" },
  { key: "villager", grid: VILLAGER, accent: "#52b788" },
  { key: "archer",   grid: ARCHER,   accent: "#84cc16" },
  { key: "priest",   grid: PRIEST,   accent: "#f5c542" },
  { key: "ninja",    grid: NINJA,    accent: "#64748b" },
  { key: "knight",   grid: KNIGHT,   accent: "#94a3b8" },
  { key: "sage",     grid: SAGE,     accent: "#14b8a6" },
  { key: "merchant", grid: MERCHANT, accent: "#f97316" },
]

function buildSVG(grid, size = 256) {
  const cols = grid[0].length
  const rows = grid.length
  const scale = Math.floor((size - 4) / rows)
  const spriteW = cols * scale
  const spriteH = rows * scale
  const spriteX = Math.round((size - spriteW) / 2)
  const spriteY = Math.round((size - spriteH) / 2)

  const rects = grid.flatMap((row, y) =>
    row.map((color, x) =>
      color
        ? `<rect x="${spriteX + x * scale}" y="${spriteY + y * scale}" width="${scale}" height="${scale}" fill="${color}"/>`
        : ""
    )
  ).join("")

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" shape-rendering="crispEdges">
  <rect width="${size}" height="${size}" fill="#66a3ff"/>
  ${rects}
</svg>`
}

async function main() {
  for (const { key, grid } of CHARS) {
    const svg = buildSVG(grid)
    const svgPath = join(OUT_DIR, `${key}.svg`)
    const pngPath = join(OUT_DIR, `${key}.png`)

    writeFileSync(svgPath, svg)

    await sharp(Buffer.from(svg))
      .png()
      .toFile(pngPath)

    console.log(`✓ ${key}`)
  }
  console.log("\n✅ 10 characters generated in public/characters/")
}

main().catch(console.error)
