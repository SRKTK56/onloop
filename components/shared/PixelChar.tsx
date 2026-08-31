type Grid = (string | null)[][]

function PixelSprite({ grid, scale = 4 }: { grid: Grid; scale?: number }) {
  const rows = grid.length
  const cols = grid[0]?.length ?? 0
  return (
    <svg
      width={cols * scale}
      height={rows * scale}
      style={{ imageRendering: "pixelated", display: "block" }}
    >
      {grid.flatMap((row, y) =>
        row.map((color, x) =>
          color ? (
            <rect
              key={`${x}-${y}`}
              x={x * scale}
              y={y * scale}
              width={scale}
              height={scale}
              fill={color}
            />
          ) : null
        )
      )}
    </svg>
  )
}

// ── カラーパレット ──
const sk = "#f5c19a"  // 肌
const ey = "#1a1a1a"  // 目
const mo = "#c04040"  // 口
const bk = "#0a0a0a"  // 黒
const wh = "#f0f0f0"  // 白

// 1. 勇者（青）
const HERO: Grid = [
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
const WARRIOR: Grid = [
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
const MAGE: Grid = [
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
const VILLAGER: Grid = [
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
const ARCHER: Grid = [
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
const PRIEST: Grid = [
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

// 7. 忍者（ダーク・赤目）
const NINJA: Grid = [
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
const KNIGHT: Grid = [
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
const SAGE: Grid = [
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
const MERCHANT: Grid = [
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

export type CharType =
  | "hero" | "warrior" | "mage" | "villager"
  | "archer" | "priest" | "ninja" | "knight" | "sage" | "merchant"

const CHAR_MAP: Record<CharType, Grid> = {
  hero: HERO,
  warrior: WARRIOR,
  mage: MAGE,
  villager: VILLAGER,
  archer: ARCHER,
  priest: PRIEST,
  ninja: NINJA,
  knight: KNIGHT,
  sage: SAGE,
  merchant: MERCHANT,
}

export const CHAR_LABEL: Record<CharType, string> = {
  hero: "勇者",
  warrior: "戦士",
  mage: "魔法使い",
  villager: "村人",
  archer: "弓使い",
  priest: "僧侶",
  ninja: "忍者",
  knight: "騎士",
  sage: "賢者",
  merchant: "商人",
}

type Props = {
  type: CharType
  scale?: number
  label?: string
  sublabel?: string
}

export function PixelChar({ type, scale = 4, label, sublabel }: Props) {
  return (
    <div className="flex flex-col items-center gap-1">
      <PixelSprite grid={CHAR_MAP[type]} scale={scale} />
      {(label ?? sublabel) && (
        <div className="text-center">
          {label && <p className="font-display text-[0.7rem]" style={{ color: "#000000" }}>{label}</p>}
          {sublabel && <p className="font-display text-[0.7rem]" style={{ color: "#4a4a4a" }}>{sublabel}</p>}
        </div>
      )}
    </div>
  )
}
