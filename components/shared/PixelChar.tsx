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
const sk = "#f5c19a"   // 肌
const sd = "#d4905a"   // 肌（影）
const ey = "#1a1a1a"   // 目
const mo = "#c04040"   // 口
const wh = "#f0f0f0"   // 白
const bk = "#0a0a0a"   // 黒

// 勇者（起点者・青）
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

// 魔法使い（紫）
const MAGE: Grid = [
  [null,null,"#6a0dad","#6a0dad","#6a0dad",null,null,null],
  [null,"#8b5cf6","#8b5cf6","#8b5cf6","#8b5cf6","#8b5cf6",null,null],
  [null,sk,sk,sk,sk,sk,sk,null],
  [null,sk,ey,sk,sk,ey,sk,null],   // 目を2つ・間隔あり
  [null,sk,sk,mo,mo,sk,sk,null],   // 口を中央に
  [null,"#6a0dad","#6a0dad","#6a0dad","#6a0dad","#6a0dad","#6a0dad",null],
  ["#6a0dad","#6a0dad","#9333ea","#6a0dad","#6a0dad","#9333ea","#6a0dad","#6a0dad"],
  ["#6a0dad","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#6a0dad"],
  [null,"#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea",null],
  [null,"#4a0080","#4a0080",null,null,"#4a0080","#4a0080",null],
  [null,"#4a0080","#4a0080",null,null,"#4a0080","#4a0080",null],
  [null,bk,bk,null,null,bk,bk,null],
]

// 戦士（赤/オレンジ）
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

// 村人（緑）
const VILLAGER: Grid = [
  [null,null,"#5d3010","#5d3010","#5d3010",null,null,null],
  [null,"#5d3010","#5d3010","#5d3010","#5d3010","#5d3010",null,null],
  [null,sk,sk,sk,sk,sk,sk,null],
  [null,sk,ey,sk,sk,ey,sk,null],   // 目を2つ・勇者と同じ配置
  [null,sk,sk,mo,mo,sk,sk,null],   // 口を中央に
  [null,"#2d6a4f","#2d6a4f","#2d6a4f","#2d6a4f","#2d6a4f","#2d6a4f",null],
  ["#2d6a4f","#2d6a4f","#52b788","#2d6a4f","#2d6a4f","#52b788","#2d6a4f","#2d6a4f"],
  ["#2d6a4f","#52b788","#52b788","#52b788","#52b788","#52b788","#52b788","#2d6a4f"],
  [null,"#52b788","#52b788","#52b788","#52b788","#52b788","#52b788",null],
  [null,"#1b4332","#1b4332",null,null,"#1b4332","#1b4332",null],
  [null,"#1b4332","#1b4332",null,null,"#1b4332","#1b4332",null],
  [null,bk,bk,null,null,bk,bk,null],
]

export type CharType = "hero" | "mage" | "warrior" | "villager"

const CHAR_MAP: Record<CharType, Grid> = {
  hero: HERO,
  mage: MAGE,
  warrior: WARRIOR,
  villager: VILLAGER,
}

const CHAR_LABEL: Record<CharType, string> = {
  hero: "勇者",
  mage: "魔法使い",
  warrior: "戦士",
  villager: "村人",
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
          {label && <p className="font-pixel text-[0.38rem]" style={{ color: "#e0e8ff" }}>{label}</p>}
          {sublabel && <p className="font-pixel text-[0.3rem]" style={{ color: "#607080" }}>{sublabel}</p>}
        </div>
      )}
    </div>
  )
}
