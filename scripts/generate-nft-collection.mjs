import sharp from "sharp"
import { writeFileSync, mkdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const NFT_DIR   = join(__dirname, "../public/nft-samples")
const TRAIT_DIR = join(__dirname, "../public/nft-traits")
mkdirSync(NFT_DIR,   { recursive: true })
mkdirSync(TRAIT_DIR, { recursive: true })

// ── レイアウト定数 ───────────────────────────────────────────
const SC = 16, SZ = 256
const CW = 8 * SC   // 128
const CH = 12 * SC  // 192
const CX = (SZ - CW) / 2   // 64
const CY = (SZ - CH) / 2   // 32

function rects(grid, ox, oy, sc = SC) {
  return grid.flatMap((row, y) =>
    row.map((c, x) => c
      ? `<rect x="${ox + x*sc}" y="${oy + y*sc}" width="${sc}" height="${sc}" fill="${c}"/>`
      : "")
  ).join("")
}

// ── パレット ────────────────────────────────────────────────
const sk = "#f5c19a", ey = "#1a1a1a", mo = "#c04040", bk = "#0a0a0a", wh = "#f0f0f0"

// ── キャラクター 10体 ────────────────────────────────────────
const CHARS = {
  hero: [
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
  ],
  warrior: [
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
  ],
  mage: [
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
  ],
  villager: [
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
  ],
  archer: [
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
  ],
  priest: [
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
  ],
  ninja: [
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
  ],
  knight: [
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
  ],
  sage: [
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
  ],
  merchant: [
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
  ],
}

// ── 帽子トレイト（8種）──────────────────────────────────────
// extraRows: キャラ行0より上に何行はみ出るか
const HATS = {
  none: null,

  straw: {
    label: "麦わら帽子", extraRows: 0,
    grid: [
      ["#e8c050","#e8c050","#e8c050","#e8c050","#e8c050","#e8c050","#e8c050","#e8c050"],
      [null,"#c8900a","#c8900a","#c8900a","#c8900a","#c8900a","#c8900a",null],
    ],
  },

  beanie: {
    label: "ビーニー", extraRows: 0,
    grid: [
      [null,"#cc3344","#aa2233","#cc3344","#aa2233","#cc3344","#aa2233",null],
      [null,"#aa2233","#cc3344","#aa2233","#cc3344","#aa2233","#cc3344",null],
    ],
  },

  kabuto: {
    label: "兜", extraRows: 1,
    grid: [
      [null,null,null,"#909090","#909090",null,null,null],           // 兜の頂点
      [null,"#707080","#909090","#a0a0b0","#a0a0b0","#909090","#707080",null],
      [null,"#606070","#808090","#606070","#606070","#808090","#606070",null],
    ],
  },

  tophat: {
    label: "山高帽", extraRows: 2,
    grid: [
      [null,null,"#2a2a2a","#2a2a2a","#2a2a2a","#2a2a2a",null,null],
      [null,null,"#2a2a2a","#2a2a2a","#2a2a2a","#2a2a2a",null,null],
      [null,null,"#333333","#2a2a2a","#2a2a2a","#333333",null,null],
      ["#1a1a1a","#1a1a1a","#1a1a1a","#1a1a1a","#1a1a1a","#1a1a1a","#1a1a1a","#1a1a1a"],
    ],
  },

  explorer: {
    label: "探検家ハット", extraRows: 0,
    grid: [
      ["#b87040","#b87040","#b87040","#b87040","#b87040","#b87040","#b87040","#b87040"],
      [null,"#8B5E3C","#b87040","#b87040","#b87040","#b87040","#8B5E3C",null],
    ],
  },

  crown: {
    label: "クラウン", extraRows: 1,
    grid: [
      [null,"#FFD700",null,"#FFD700",null,"#FFD700",null,null],
      [null,"#FFD700","#FFD700","#FFD700","#FFD700","#FFD700","#FFD700",null],
      [null,"#FFB800","#FFD700","#FFD700","#FFD700","#FFD700","#FFB800",null],
    ],
  },

  halo: {
    label: "ハロー", extraRows: 2,
    grid: [
      [null,"#FFE840","#FFE840","#FFE840","#FFE840","#FFE840",null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
    ],
  },
}

// ── アイテムトレイト（8種）──────────────────────────────────
// col, row: キャラ左上(CX,CY)からのグリッドオフセット
const ITEMS = {
  none: null,

  scroll: {
    label: "巻物", col: 6, row: 7,
    grid: [
      ["#c8a050","#c8a050"],
      ["#e8d090","#e8d090"],
      ["#e8d090","#e8d090"],
      ["#c8a050","#c8a050"],
    ],
  },

  torch: {
    label: "松明", col: 6, row: 4,
    grid: [
      ["#ff8800",null],
      ["#ffaa00","#ff6600"],
      ["#8B5E3C","#8B5E3C"],
      ["#8B5E3C","#8B5E3C"],
      ["#6B3E2C","#6B3E2C"],
    ],
  },

  sword: {
    label: "剣", col: 6, row: 3,
    grid: [
      ["#d0d8e0",null],
      ["#d0d8e0",null],
      ["#d0d8e0","#FFD700"],
      ["#c0c8d0","#c0c8d0"],
      [null,"#888890"],
    ],
  },

  staff: {
    label: "杖", col: 6, row: 2,
    grid: [
      ["#9333ea"],
      ["#8B5E3C"],
      ["#8B5E3C"],
      ["#8B5E3C"],
      ["#6B3E2C"],
      ["#6B3E2C"],
    ],
  },

  globe: {
    label: "地球儀", col: 5, row: 6,
    grid: [
      [null,"#1a8aaa","#1a8aaa",null],
      ["#1a8aaa","#3aaa3a","#1a8aaa","#1a8aaa"],
      ["#1a8aaa","#1a8aaa","#3aaa3a","#1a8aaa"],
      [null,"#1a8aaa","#1a8aaa",null],
    ],
  },

  star: {
    label: "星", col: 5, row: 5,
    grid: [
      [null,"#FFD700",null],
      ["#FFD700","#FFF080","#FFD700"],
      [null,"#FFD700",null],
    ],
  },

  galaxy: {
    label: "銀河オーブ", col: 5, row: 5,
    grid: [
      [null,"#8a3aaa","#6a2a8a",null],
      ["#8a3aaa","#d090f0","#8a3aaa","#8a3aaa"],
      ["#6a2a8a","#8a3aaa","#d090f0","#6a2a8a"],
      [null,"#6a2a8a","#8a3aaa",null],
    ],
  },
}

// ── 服バリアント ─────────────────────────────────────────────
// 各キャラの「アウトフィット色」を p(明)/s(中)/t(暗) に分類
const CHAR_PALETTE = {
  hero:     { p: ["#0052FF"],           s: ["#003db5"],           t: ["#1a1a4a"]           },
  warrior:  { p: ["#e63946"],           s: ["#c0392b"],           t: ["#4a1010"]           },
  mage:     { p: ["#9333ea","#8b5cf6"], s: ["#6a0dad"],           t: ["#4a0080"]           },
  villager: { p: ["#52b788"],           s: ["#2d6a4f"],           t: ["#1b4332"]           },
  archer:   { p: ["#84cc16"],           s: ["#4a7c18"],           t: ["#3a5c10"]           },
  priest:   { p: ["#f0f0f0"],           s: [],                    t: []                    }, // 金十字は保持
  ninja:    { p: ["#64748b"],           s: ["#475569","#334155"], t: ["#1e293b"]           },
  knight:   { p: ["#94a3b8","#cbd5e1"], s: ["#64748b"],           t: ["#475569"]           },
  sage:     { p: ["#2dd4bf","#14b8a6"], s: ["#0d7a6e"],           t: []                    },
  merchant: { p: ["#fb923c"],           s: ["#f97316"],           t: ["#c2410c"]           },
}

// 6種のカラーバリアント
const VARIANTS = [
  { idx: 0, name: "Standard",  label: "スタンダード", p: null,      s: null,      t: null      },
  { idx: 1, name: "Emerald",   label: "エメラルド",   p: "#4ade80", s: "#16a34a", t: "#052e16" },
  { idx: 2, name: "Shadow",    label: "シャドウ",     p: "#9ca3af", s: "#374151", t: "#111827" },
  { idx: 3, name: "Crimson",   label: "クリムゾン",   p: "#f87171", s: "#b91c1c", t: "#450a0a" },
  { idx: 4, name: "Gold",      label: "ゴールド",     p: "#fcd34d", s: "#b45309", t: "#78350f" },
  { idx: 5, name: "Amethyst",  label: "アメシスト",   p: "#c4b5fd", s: "#7c3aed", t: "#2e1065" },
]

function applyVariant(grid, charKey, variantIdx) {
  if (variantIdx === 0) return grid
  const pal = CHAR_PALETTE[charKey]
  const v   = VARIANTS[variantIdx]
  const map = {}
  if (v.p) pal.p.forEach(c => { map[c] = v.p })
  if (v.s) pal.s.forEach(c => { map[c] = v.s })
  if (v.t) pal.t.forEach(c => { map[c] = v.t })
  return grid.map(row => row.map(c => map[c] ?? c))
}

// ── 背景レイヤー ─────────────────────────────────────────────
function bgLayer(stageNum) {
  const cfgs = [
    { base: "#3a6a2a", tile: "#4a7a3a", type: "hstripe" },  // 1 村
    { base: "#28283a", tile: "#363648", type: "brick"   },  // 2 街
    { base: "#a03050", tile: "#c85080", type: "dot"     },  // 3 日本
    { base: "#1a3a2a", tile: "#c8a000", type: "diamond" },  // 4 アジア
    { base: "#181c30", tile: "#384060", type: "cross"   },  // 5 欧米
    { base: "#0a3a5a", tile: "#1a6a9a", type: "wave"    },  // 6 世界
    { base: "#080e28", tile: "#1a2a60", type: "arc"     },  // 7 地球
    { base: "#06060e", tile: "#ffffff", type: "stars"   },  // 8 宇宙
  ]
  const { base, tile, type } = cfgs[stageNum - 1]

  let pattern = ""
  if (type === "hstripe") {
    for (let i = 0; i < SZ; i += 16)
      pattern += `<rect x="0" y="${i}" width="${SZ}" height="8" fill="${tile}" opacity="0.35"/>`
  } else if (type === "brick") {
    for (let r = 0; r < SZ / 16; r++) {
      const off = r % 2 === 0 ? 0 : 16
      for (let c = 0; c < SZ / 32 + 1; c++)
        pattern += `<rect x="${c*32+off}" y="${r*16}" width="30" height="14" fill="${tile}" opacity="0.25"/>`
    }
  } else if (type === "dot") {
    for (let r = 0; r < SZ / 24; r++)
      for (let c = 0; c < SZ / 24; c++)
        pattern += `<rect x="${c*24+4}" y="${r*24+4}" width="8" height="8" fill="${tile}" opacity="0.3"/>`
  } else if (type === "diamond") {
    for (let r = 0; r < SZ / 16; r++)
      for (let c = 0; c < SZ / 16; c++)
        if ((r + c) % 2 === 0)
          pattern += `<rect x="${c*16}" y="${r*16}" width="16" height="16" fill="${tile}" opacity="0.25"/>`
  } else if (type === "cross") {
    for (let i = 0; i < SZ; i += 32) {
      pattern += `<rect x="${i}" y="0" width="1" height="${SZ}" fill="${tile}" opacity="0.2"/>`
      pattern += `<rect x="0" y="${i}" width="${SZ}" height="1" fill="${tile}" opacity="0.2"/>`
    }
  } else if (type === "wave") {
    for (let r = 0; r < SZ / 16; r++)
      pattern += `<rect x="0" y="${r*16 + (r%2)*6}" width="${SZ}" height="6" fill="${tile}" opacity="0.3"/>`
  } else if (type === "arc") {
    for (let i = 1; i <= 4; i++)
      pattern += `<rect x="${SZ/2 - i*40}" y="${SZ - i*30}" width="${i*80}" height="8" fill="${tile}" opacity="${0.15*i}"/>`
  } else if (type === "stars") {
    const positions = [
      [12,18],[45,8],[88,25],[130,12],[178,30],[220,8],[248,20],
      [30,55],[70,42],[110,60],[160,48],[200,55],[240,40],
      [15,90],[55,80],[100,95],[145,85],[190,100],[235,88],
      [25,130],[75,120],[120,138],[165,125],[210,130],[250,118],
      [10,165],[50,158],[95,172],[140,160],[185,168],[230,155],[252,170],
      [20,200],[60,195],[105,210],[150,198],[195,205],[238,198],
      [35,235],[80,228],[125,242],[170,230],[215,238],[248,230],
    ]
    for (const [x, y] of positions) {
      const sz = (x + y) % 3 === 0 ? 3 : (x + y) % 2 === 0 ? 2 : 1
      pattern += `<rect x="${x}" y="${y}" width="${sz}" height="${sz}" fill="${tile}"/>`
    }
  }

  return `<rect width="${SZ}" height="${SZ}" fill="${base}"/>${pattern}`
}

// ── エフェクトレイヤー ───────────────────────────────────────
function effectLayer(type, accent) {
  if (!type || type === "none") return ""
  if (type === "glow") {
    return [
      `<rect x="${CX-6}"  y="${CY-6}"  width="${CW+12}" height="${CH+12}" fill="none" stroke="${accent}" stroke-width="3" opacity="0.5"/>`,
      `<rect x="${CX-12}" y="${CY-12}" width="${CW+24}" height="${CH+24}" fill="none" stroke="${accent}" stroke-width="2" opacity="0.25"/>`,
      `<rect x="${CX-18}" y="${CY-18}" width="${CW+36}" height="${CH+36}" fill="none" stroke="${accent}" stroke-width="1" opacity="0.12"/>`,
    ].join("")
  }
  if (type === "sparkle") {
    const pts = [[CX-8,CY-8],[CX+CW+8,CY-8],[CX-8,CY+CH+8],[CX+CW+8,CY+CH+8],[SZ/2,CY-14]]
    return pts.map(([x,y]) => [
      `<rect x="${x-1}" y="${y-5}" width="2" height="10" fill="${accent}" opacity="0.8"/>`,
      `<rect x="${x-5}" y="${y-1}" width="10" height="2" fill="${accent}" opacity="0.8"/>`,
    ].join("")).join("")
  }
  if (type === "aura") {
    return [1,2,3,4].map(i =>
      `<rect x="${CX-i*4}" y="${CY-i*4}" width="${CW+i*8}" height="${CH+i*8}" fill="none" stroke="${accent}" stroke-width="2" opacity="${0.5-i*0.1}"/>`
    ).join("")
  }
  if (type === "cosmic") {
    const cx = SZ/2, cy = SZ/2
    return [
      `<rect x="${cx-50}" y="${cy-2}" width="100" height="4" fill="${accent}" opacity="0.4"/>`,
      `<rect x="${cx-2}" y="${cy-50}" width="4" height="100" fill="${accent}" opacity="0.4"/>`,
      ...[30,50,70].map(r =>
        `<rect x="${cx-r}" y="${cy-r}" width="${r*2}" height="${r*2}" fill="none" stroke="${accent}" stroke-width="1" opacity="${0.4-r/200}"/>`
      ),
    ].join("")
  }
  return ""
}

// ── フレームレイヤー ─────────────────────────────────────────
function frameLayer(stageNum, accent) {
  const s = stageNum
  const w = SZ
  if (s <= 2) {
    return `<rect x="0" y="0" width="${w}" height="${w}" fill="none" stroke="${accent}" stroke-width="3"/>`
  }
  if (s <= 4) {
    return [
      `<rect x="0" y="0" width="${w}" height="${w}" fill="none" stroke="${accent}" stroke-width="4"/>`,
      `<rect x="4" y="4" width="${w-8}" height="${w-8}" fill="none" stroke="${accent}" stroke-width="1" opacity="0.5"/>`,
    ].join("")
  }
  if (s <= 6) {
    const corners = [[0,0],[w-12,0],[0,w-12],[w-12,w-12]]
    const deco = corners.map(([x,y]) => `<rect x="${x}" y="${y}" width="12" height="12" fill="${accent}"/>`).join("")
    return [
      `<rect x="0" y="0" width="${w}" height="${w}" fill="none" stroke="${accent}" stroke-width="5"/>`,
      `<rect x="5" y="5" width="${w-10}" height="${w-10}" fill="none" stroke="${accent}" stroke-width="1" opacity="0.4"/>`,
      deco,
    ].join("")
  }
  if (s === 7) {
    const diamonds = [[0,w/2-8],[w-16,w/2-8],[w/2-8,0],[w/2-8,w-16]]
    const deco = diamonds.map(([x,y]) => `<rect x="${x}" y="${y}" width="16" height="16" fill="${accent}" transform="rotate(45,${x+8},${y+8})"/>`).join("")
    return [
      `<rect x="0" y="0" width="${w}" height="${w}" fill="none" stroke="#FFD700" stroke-width="6"/>`,
      `<rect x="6" y="6" width="${w-12}" height="${w-12}" fill="none" stroke="#FFD700" stroke-width="2" opacity="0.5"/>`,
      deco,
    ].join("")
  }
  // Stage 8 宇宙: 虹色多重フレーム
  const colors = ["#FF4444","#FF8800","#FFD700","#44FF44","#4488FF","#AA44FF"]
  return colors.map((c, i) =>
    `<rect x="${i}" y="${i}" width="${w-i*2}" height="${w-i*2}" fill="none" stroke="${c}" stroke-width="1" opacity="${0.7-i*0.08}"/>`
  ).join("")
}

// ── コンポジター ─────────────────────────────────────────────
function compose(charKey, hatKey, itemKey, effectType, stageNum, accent, variantIdx = 0) {
  const charGrid = applyVariant(CHARS[charKey], charKey, variantIdx)
  const hat  = HATS[hatKey]
  const item = ITEMS[itemKey]

  const charEl = rects(charGrid, CX, CY)
  const hatEl  = hat  ? rects(hat.grid,  CX,            CY - hat.extraRows * SC) : ""
  const itemEl = item ? rects(item.grid, CX + item.col * SC, CY + item.row * SC) : ""

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SZ}" height="${SZ}" shape-rendering="crispEdges">
  ${bgLayer(stageNum)}
  ${charEl}
  ${hatEl}
  ${itemEl}
  ${effectLayer(effectType, accent)}
  ${frameLayer(stageNum, accent)}
</svg>`
}

// ── ステージ設定（サンプル NFT 各1体、バリアント分散）────────
const STAGE_SAMPLES = [
  { num:1, name:"村",     accent:"#8B6914", char:"villager", hat:"straw",    item:"scroll", effect:"none",    variant:0 },
  { num:2, name:"街",     accent:"#6080a0", char:"merchant", hat:"beanie",   item:"torch",  effect:"none",    variant:1 },
  { num:3, name:"日本",   accent:"#e63946", char:"warrior",  hat:"kabuto",   item:"sword",  effect:"none",    variant:2 },
  { num:4, name:"アジア", accent:"#c8a000", char:"mage",     hat:"explorer", item:"staff",  effect:"none",    variant:3 },
  { num:5, name:"欧米",   accent:"#0052FF", char:"hero",     hat:"tophat",   item:"sword",  effect:"glow",    variant:4 },
  { num:6, name:"世界",   accent:"#52b788", char:"knight",   hat:"crown",    item:"globe",  effect:"sparkle", variant:5 },
  { num:7, name:"地球",   accent:"#f5c542", char:"priest",   hat:"crown",    item:"star",   effect:"aura",    variant:1 },
  { num:8, name:"宇宙",   accent:"#9333ea", char:"sage",     hat:"halo",     item:"galaxy", effect:"cosmic",  variant:5 },
]

// ── メイン ───────────────────────────────────────────────────
async function main() {
  const VARIANT_DIR = join(TRAIT_DIR, "variants")
  mkdirSync(VARIANT_DIR, { recursive: true })

  // 8体のサンプルNFT（バリアント分散）
  for (const s of STAGE_SAMPLES) {
    const svg = compose(s.char, s.hat, s.item, s.effect, s.num, s.accent, s.variant)
    const png = join(NFT_DIR, `stage${s.num}_${s.name}.png`)
    await sharp(Buffer.from(svg)).png().toFile(png)
    console.log(`✓ NFT sample stage${s.num}: ${s.char} / ${VARIANTS[s.variant].label}`)
  }

  // 全10キャラ × 6バリアント = 60枚のプレビュー
  console.log("\n── バリアントプレビュー生成中 ──")
  const chars = Object.keys(CHARS)
  for (const charKey of chars) {
    for (const v of VARIANTS) {
      const svg = compose(charKey, "none", "none", "none", 5, "#0052FF", v.idx)
      const png = join(VARIANT_DIR, `${charKey}_${v.name.toLowerCase()}.png`)
      await sharp(Buffer.from(svg)).png().toFile(png)
    }
    console.log(`✓ ${charKey}: 6バリアント生成`)
  }

  // 帽子トレイトのプレビュー（ヒーローベース）
  for (const [key, hat] of Object.entries(HATS)) {
    const svg = compose("hero", key, "none", "none", 5, "#0052FF")
    const png = join(TRAIT_DIR, `hat_${key}.png`)
    await sharp(Buffer.from(svg)).png().toFile(png)
    console.log(`✓ Hat trait: hat_${key}`)
  }

  // アイテムトレイトのプレビュー（ヒーローベース）
  for (const [key, item] of Object.entries(ITEMS)) {
    const svg = compose("hero", "none", key, "none", 5, "#0052FF")
    const png = join(TRAIT_DIR, `item_${key}.png`)
    await sharp(Buffer.from(svg)).png().toFile(png)
    console.log(`✓ Item trait: item_${key}`)
  }

  // エフェクトプレビュー（ヒーローベース）
  for (const [eff, accent] of [["glow","#0052FF"],["sparkle","#FFD700"],["aura","#9333ea"],["cosmic","#6a3aaa"]]) {
    const svg = compose("hero", "crown", "star", eff, 7, accent)
    const png = join(TRAIT_DIR, `effect_${eff}.png`)
    await sharp(Buffer.from(svg)).png().toFile(png)
    console.log(`✓ Effect trait: effect_${eff}`)
  }

  const totalCombos = Object.keys(CHARS).length * Object.keys(HATS).length * Object.keys(ITEMS).length * 5 * VARIANTS.length
  console.log("\n✅ Complete!")
  console.log(`   NFT samples  → public/nft-samples/         (${STAGE_SAMPLES.length} files)`)
  console.log(`   Variants     → public/nft-traits/variants/ (${Object.keys(CHARS).length * VARIANTS.length} files)`)
  console.log(`   Trait sheets → public/nft-traits/          (hats:${Object.keys(HATS).length} / items:${Object.keys(ITEMS).length} / effects:4)`)
  console.log(`\n   理論上の組み合わせ数: ${totalCombos.toLocaleString()} 通り`)
}

main().catch(console.error)
